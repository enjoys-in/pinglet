/**
 * Pinglet SDK v0.0.3 — Toast System
 * Manages toast notification container, sound, branding, transitions, and stacking.
 */

/** @typedef {import('./types/index.js').GlobalConfig} GlobalConfig */
/** @typedef {import('./types/index.js').ProjectConfig} ProjectConfig */

import { fireCustomEvent } from "./events.js";

// ─── Module State ───

/** @type {HTMLAudioElement|null} */
let soundPlayer = null;

/** @type {HTMLDivElement|null} */
let toastContainer = null;

/** @type {HTMLDivElement|null} */
export let toastStack = null;

/** @type {HTMLDivElement|null} */
export let brandingElement = null;

// ─── Sound ───

/**
 * Initialize sound player from global config.
 * Waits for the source to be loadable before marking ready.
 * @param {GlobalConfig} globalConfig
 * @returns {HTMLAudioElement|undefined}
 */
export function initSound(globalConfig) {
	if (soundPlayer) return soundPlayer;
	const sound = globalConfig.config.sound;
	if (sound?.play && sound.src) {
		const audio = new Audio();
		audio.volume = sound.volume ?? 0.5;
		audio.preload = "auto";

		// Mark ready only when the browser can actually play the source
		audio.addEventListener("canplaythrough", () => { soundPlayer = audio; }, { once: true });
		audio.addEventListener("error", () => { soundPlayer = null; }, { once: true });

		audio.src = sound.src;
	}
}

/**
 * Play the notification sound.
 * Safely guards against unsupported / unloaded sources.
 */
export function playSound() {
	if (!soundPlayer) return;
	if (soundPlayer.readyState < HTMLMediaElement.HAVE_ENOUGH_DATA) return;
	soundPlayer.currentTime = 0;
	soundPlayer.play().catch(() => {});
}

// ─── Branding ───

/**
 * Create or retrieve the Pinglet branding element.
 * @param {ProjectConfig["branding"]} branding
 * @returns {HTMLDivElement}
 */
export function createBrandingElement(branding) {
	if (brandingElement) return brandingElement;
	brandingElement = document.createElement("div");
	brandingElement.className = "pinglet-branding";
	brandingElement.innerHTML =
		branding?.html ||
		'Notifications by <a href="https://pinglet.enjoys.in" class="pinglet-link" target="_blank" rel="noopener noreferrer" style="color:#4da6ff;text-decoration:none;">Pinglet</a>';
	Object.assign(brandingElement.style, {
		fontSize: "11px",
		color: "#808080",
		textAlign: "right",
		width: "100%",
		pointerEvents: "auto",
	});
	return brandingElement;
}

// ─── Toast Container ───

/**
 * Create or retrieve the toast container and stack.
 * @param {ProjectConfig["branding"]} branding
 * @returns {{ toastContainer: HTMLDivElement, toastStack: HTMLDivElement }}
 */
function createToastContainer(branding) {
	if (toastContainer && toastStack) return { toastContainer, toastStack };

	const existing = document.getElementById("pinglet-widget-container");
	if (existing) {
		toastContainer = existing;
		toastStack = toastContainer.querySelector(".pinglet-widget-stack");
		return { toastContainer, toastStack };
	}

	toastContainer = document.createElement("div");
	toastContainer.id = "pinglet-widget-container";
	Object.assign(toastContainer.style, {
		position: "fixed",
		bottom: "20px",
		left: "20px",
		zIndex: "9999",
		display: "flex",
		flexDirection: "column",
		alignItems: "flex-start",
		gap: "8px",
		maxWidth: "360px",
		width: "360px",
		boxSizing: "border-box",
		pointerEvents: "none",
		padding: "4px",
		borderRadius: "8px",
	});

	toastStack = document.createElement("div");
	toastStack.className = "pinglet-widget-stack";
	Object.assign(toastStack.style, {
		display: "flex",
		flexDirection: "column",
		gap: "12px",
		pointerEvents: "none",
		overflow: "visible",
		flexShrink: "0",
	});

	toastContainer.appendChild(toastStack);

	if (branding?.show && branding?.once) {
		toastContainer.appendChild(createBrandingElement(branding));
	}

	document.body.appendChild(toastContainer);
	return { toastContainer, toastStack };
}

// ─── Transitions ───

/**
 * Apply entrance animation to an element.
 * @param {HTMLElement} el
 * @param {"fade"|"slide"|"zoom"} type
 */
function applyTransition(el, type) {
	el.style.opacity = "0";
	el.style.transition = "all 0.4s ease";

	switch (type) {
		case "fade":
			el.style.transform = "translateX(20px)";
			break;
		case "slide":
			el.style.transform = "translateX(100%)";
			break;
		case "zoom":
			el.style.transform = "scale(0.8)";
			break;
		default:
			el.style.opacity = "1";
			return;
	}

	requestAnimationFrame(() => {
		el.style.opacity = "1";
		el.style.transform = type === "zoom" ? "scale(1)" : "translateX(0)";
	});
}

/**
 * Apply exit animation and remove element from DOM.
 * @param {HTMLElement} toast
 * @param {"fade"|"slide"|"zoom"} type
 */
function removeToast(toast, type) {
	if (!toast) return;
	toast.style.transition = "all 0.4s ease";

	switch (type) {
		case "fade":
			toast.style.opacity = "0";
			toast.style.transform = "translateX(-40px)";
			break;
		case "slide":
			toast.style.transform = "translateX(-100%)";
			toast.style.opacity = "0";
			break;
		case "zoom":
			toast.style.transform = "scale(0.8)";
			toast.style.opacity = "0";
			break;
		default:
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

// ─── Render Toast ───

/**
 * Render a toast notification with the given content element.
 * Handles auto-dismiss, pause-on-hover, and stacking.
 * @param {HTMLElement} contentEl - The notification content element
 * @param {GlobalConfig} globalConfig - The global configuration
 * @returns {{ toastContainer: HTMLDivElement, toastStack: HTMLDivElement }}
 */
export function renderToast(contentEl, globalConfig) {
	const config = globalConfig.config;
	const { toastContainer, toastStack } = createToastContainer(config.branding);

	if (config?.branding?.show && config?.branding?.once && brandingElement) {
		toastContainer.appendChild(brandingElement);
	}

	applyTransition(contentEl, config.transition);
	contentEl.style.pointerEvents = "auto";
	toastStack.appendChild(contentEl);

	let closeTimeout;

	function startCloseTimer() {
		if (config?.auto_dismiss) {
			closeTimeout = setTimeout(() => {
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

// ─── Event Body Helper ───

/**
 * Prepare and dispatch a notification event from a toast element.
 * @param {"clicked"|"dropped"|"closed"} event - Event type
 * @param {HTMLElement} contentEl - Toast element
 * @param {string} [reason="user-dismiss"] - Reason
 */
export function prepareEventBody(event, contentEl, reason = "user-dismiss") {
	const projectId = window.projectId;
	if (!projectId) return;

	const key =
		contentEl.getAttribute("data-key") ||
		contentEl.id ||
		`${Date.now()}-unknown`;

	window.sendNotificationEvent?.(event, {
		project_id: projectId,
		notification_id: key,
		timestamp: Date.now(),
		reason,
		type: contentEl.getAttribute("data-notification-type") || "0",
	});
}
