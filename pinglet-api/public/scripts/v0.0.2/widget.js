/** @typedef {import('./types/index.js').GlobalConfig} GlobalConfig */
/** @typedef {import('./types/project.config.js').ProjectConfig} ProjectConfig */

/** @type {HTMLAudioElement|null} */
let soundPlayer;

/** @type {HTMLDivElement|null} */
let toastContainer;

/** @type {HTMLDivElement|null} */
export let toastStack = null;

/** @type {HTMLDivElement|null} */
export let brandingElement = null;

/** @type {string|null} */
let soundSrc = null;
/**
 * Initialize the widget by creating a sound player if the sound config is
 * enabled and has a valid src.
 *
 * @param {GlobalConfig} globalConfig - Global config object passed to the widget.
 * @returns {Audio|undefined} The created sound player or undefined if the
 * sound config is disabled.
 */
export function initWidget(globalConfig) {
	if (soundPlayer) return soundPlayer;
	if (globalConfig.config.sound?.play && globalConfig.config.sound.src) {
		soundSrc = globalConfig.config.sound.src;
		soundPlayer = new Audio(soundSrc || globalConfig.config.sound.src);
		soundPlayer.volume = globalConfig.config.sound.volume ?? 0.5;
	}
}
export function playSound() {
	if (soundPlayer) {
		soundPlayer.currentTime = 0;
		soundPlayer.play();
	}
}
/**
 * Creates a branding element for the widget.
 *
 * @param {ProjectConfig["branding"]} branding - Branding config object with an optional 'html'
 * property.
 * @returns {HTMLDivElement} The created branding element.
 */
export function createBrandingElement(branding) {
	if (brandingElement) return brandingElement;
	brandingElement = document.createElement("div");
	brandingElement.className = "pinglet-branding";
	brandingElement.innerHTML =
		branding?.html ||
		`Notifications by <a href="https://pinglet.enjoys.in" class="pinglet-link" target="_blank" style="color:#4da6ff;text-decoration:none;">Pinglet</a>`;
	brandingElement.style = `
      font-size: 11px;
      color: #808080;
      text-align: right;
      width: 100%;
      pointer-events: auto;
    `;
	return brandingElement;
}
/**
 * Creates or retrieves a toast notification container and stack.
 *
 * This function either returns existing container and stack elements,
 * or creates new ones for toast notifications, positioning them
 * at the bottom-left of the viewport. Optionally includes branding
 * if specified.
 *
 * @param {ProjectConfig["branding"]} branding - The branding configuration object.
 * @returns {{ toastContainer: HTMLDivElement, toastStack: HTMLDivElement }} An object containing the toast container and stack elements.
 */
function createPingletToastContainer(branding) {
	if (toastContainer && toastStack) return { toastContainer, toastStack };

	const existing = document.getElementById("pinglet-widget-container");
	if (existing) {
		toastContainer = existing;
		toastStack = toastContainer.querySelector(".pinglet-widget-stack");
		return { toastContainer, toastStack };
	}

	// Outer fixed-position wrapper
	toastContainer = document.createElement("div");
	toastContainer.id = "pinglet-widget-container";
	toastContainer.style.position = "fixed";
	toastContainer.style.bottom = "20px";
	toastContainer.style.left = "20px";
	toastContainer.style.zIndex = "9999";
	toastContainer.style.display = "flex";
	toastContainer.style.flexDirection = "column";
	toastContainer.style.alignItems = "flex-start";
	toastContainer.style.gap = "8px";
	toastContainer.style.maxWidth = "360px";
	toastContainer.style.width = "360px";
	toastContainer.style.boxSizing = "border-box";
	toastContainer.style.pointerEvents = "none";
	toastContainer.style.padding = "4px";

	// Add some subtle background and shadow for the container itself (optional)

	toastContainer.style.borderRadius = "8px";

	// Toast stack (notifications only)
	toastStack = document.createElement("div");
	toastStack.className = "pinglet-widget-stack";
	toastStack.style.display = "flex";
	toastStack.style.flexDirection = "column";

	toastStack.style.gap = "12px";
	toastStack.style.pointerEvents = "none";
	toastStack.style.overflow = "visible";
	toastStack.style.flexShrink = "0";

	toastContainer.appendChild(toastStack);

	// Branding (always at bottom)
	if (branding?.show && branding?.once) {
		toastContainer.appendChild(createBrandingElement(branding));
	}

	document.body.appendChild(toastContainer);
	return { toastContainer, toastStack };
}

/**
 * Renders a new toast notification with a given content element.
 * @param {HTMLElement} contentEl the content element of the toast notification
 * @param {GlobalConfig} globalConfig the global config object
 */
export function renderToast(contentEl, globalConfig) {
	const config = globalConfig.config;

	const { toastContainer, toastStack } = createPingletToastContainer(
		config.branding,
	);

	if (config?.branding?.show && config?.branding?.once) {
		toastContainer.appendChild(brandingElement);
	}
	applyTransition(contentEl, config.transition);
	contentEl.style.pointerEvents = "auto";

	toastStack.appendChild(contentEl);
	let closeTimeout;
	function startCloseTimer() {
		if (config?.auto_dismiss) {
			closeTimeout = setTimeout(() => {
				// Check if the content element is still in the stack
				if (toastStack.contains(contentEl)) {
					prepareEventBody("dropped", contentEl, "user doesn't engaged");
					removeToast(contentEl, config?.transition || "fade");
				}
			}, config.duration || 5000);
		}
	}

	function stopCloseTimer() {
		clearTimeout(closeTimeout);
	}
	toastContainer.addEventListener("mouseenter", stopCloseTimer);
	toastContainer.addEventListener("mouseleave", startCloseTimer);
	startCloseTimer();
	return { toastContainer, toastStack };
}

/**
 * Apply entrance animation.
 */
function applyTransition(el, type) {
	el.style.opacity = "0";
	el.style.transition = "all 0.4s ease";

	if (type === "fade") {
		el.style.transform = "translateX(20px)";
		requestAnimationFrame(() => {
			el.style.opacity = "1";
			el.style.transform = "translateX(0)";
		});
	} else if (type === "slide") {
		el.style.transform = "translateX(100%)";
		requestAnimationFrame(() => {
			el.style.opacity = "1";
			el.style.transform = "translateX(0)";
		});
	} else if (type === "zoom") {
		el.style.transform = "scale(0.8)";
		requestAnimationFrame(() => {
			el.style.opacity = "1";
			el.style.transform = "scale(1)";
		});
	} else {
		el.style.opacity = "1";
	}
}

/**
 * Apply exit animation and remove.
 */
function removeToast(toast, type) {
	if (!toast) return;

	toast.style.transition = "all 0.4s ease";

	if (type === "fade") {
		toast.style.opacity = "0";
		toast.style.transform = "translateX(-40px)";
	} else if (type === "slide") {
		toast.style.transform = "translateX(-100%)";
		toast.style.opacity = "0";
	} else if (type === "zoom") {
		toast.style.transform = "scale(0.8)";
		toast.style.opacity = "0";
	} else {
		toast.style.opacity = "0";
	}

	toast.addEventListener(
		"transitionend",
		() => {
			toast.remove();
			if (toastStack && toastStack.children.length === 0) {
				brandingElement?.remove();
			}
		},
		{ once: true },
	);
}
window.addEventListener("pinglet:notificationClosed", (event) => {
	prepareEventBody("closed", event.detail.contentEl, event.detail.reason);
	removeToast(event.detail.contentEl, "fade");
});
/**
 * Prepares and sends a notification event with the given type and reason.
 *
 * @param {"clicked"|"dropped"|"closed"} type - The type of notification event to trigger.
 * @param {HTMLElement} contentEl - The content element associated with the notification.
 * @param {string} [reason="user-dismiss"] - The reason for the event, defaulting to "user-dismiss".
 * @returns {Promise<void>}
 */
export async function prepareEventBody(
	type,
	contentEl,
	reason = "user-dismiss",
) {
	const notification_id = contentEl.getAttribute("data-notification-id");
	const notification_type =
		contentEl.getAttribute("data-notification-type") || "0";
	const [project_id, timestamp] = notification_id.split("-");

	window.sendNotificationEvent(type, {
		project_id,
		notification_id,
		timestamp,
		reason,
		type: notification_type,
	});
}
