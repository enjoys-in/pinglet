/**
 * Pinglet SDK v0.0.3 — Custom Template Wrapper
 * Functional wrapper with slide animations for custom notification templates.
 * (Replaces both wrapper-v1 and wrapper-v2 from v0.0.2)
 */

import { prepareEventBody } from "./toast.js";

const wrapperConfig = {
	autoCloseDelay: 10000,
	brandingText: "Powered by Enjoys",
	brandingPosition: "right",
	defaultClass: "pinglet-widget-wrapper",
	spacing: 2,
	maxVisible: 3,
	side: "right",
};

// Inject animations once
if (!document.getElementById("pinglet-wrapper-anim")) {
	const styleSheet = document.createElement("style");
	styleSheet.id = "pinglet-wrapper-anim";
	styleSheet.textContent = `
@keyframes pinglet-wrapSlideIn {
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes pinglet-wrapSlideOut {
  from { opacity: 1; transform: translateY(0); }
  to { opacity: 0; transform: translateY(40px); }
}`;
	document.head.appendChild(styleSheet);
}

// ─── Containers (left/right) ───

function ensureContainer(id, side) {
	let container = document.getElementById(id);
	if (!container) {
		container = document.createElement("div");
		container.id = id;
		Object.assign(container.style, {
			position: "fixed",
			zIndex: "9999",
			display: "flex",
			flexDirection: "column-reverse",
			gap: `${wrapperConfig.spacing}px`,
			pointerEvents: "none",
			bottom: "20px",
		});
		container.classList.add(wrapperConfig.defaultClass);
		container.style[side === "left" ? "left" : "right"] = "20px";
		document.body.appendChild(container);
	}
	return container;
}

const containerRight = ensureContainer("pinglet-wrapper-right", "right");
const containerLeft = ensureContainer("pinglet-wrapper-left", "left");

// Queues per side
const queues = { left: [], right: [] };
const visible = { left: [], right: [] };

/**
 * Create a notification wrapper with custom elements.
 * @param {HTMLElement[]} [dynamicElements] - Child elements to render inside the wrapper
 * @param {Object} [customConfig] - Override default wrapper config
 * @returns {HTMLDivElement}
 */
export function createWrapper(dynamicElements = [], customConfig = {}) {
	const finalConfig = { ...wrapperConfig, ...customConfig };

	const wrapper = document.createElement("div");
	wrapper.id = "pinglet-custom-wrapper";
	Object.assign(wrapper.style, {
		position: "relative",
		width: "300px",
		borderRadius: "10px",
		boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
		backgroundColor: "#fff",
		transition: "transform 0.3s ease, opacity 0.3s ease",
		animation: "pinglet-wrapSlideIn 0.4s forwards",
		pointerEvents: "all",
	});

	for (const el of dynamicElements) wrapper.appendChild(el);

	// Close button
	const closeBtn = document.createElement("button");
	closeBtn.textContent = "×";
	Object.assign(closeBtn.style, {
		position: "absolute",
		top: "-10px",
		right: "-10px",
		width: "25px",
		height: "25px",
		borderRadius: "50%",
		border: "none",
		backgroundColor: "#f00",
		color: "#fff",
		fontSize: "16px",
		fontWeight: "bold",
		cursor: "pointer",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
	});
	closeBtn.addEventListener("click", (e) => {
		e.stopPropagation();
		stopCloseTimer();
		prepareEventBody("closed", wrapper);
		removeWrapper(wrapper, finalConfig.side);
	});
	wrapper.appendChild(closeBtn);

	// Branding
	const branding = document.createElement("div");
	branding.textContent = finalConfig.brandingText;
	Object.assign(branding.style, {
		position: "absolute",
		bottom: "5px",
		fontSize: "12px",
		color: "#666",
	});
	branding.style[finalConfig.brandingPosition] = "10px";
	wrapper.appendChild(branding);

	// Auto-close timer
	let closeTimeout;

	function startCloseTimer() {
		closeTimeout = setTimeout(() => {
			if (containerLeft.contains(wrapper) || containerRight.contains(wrapper)) {
				prepareEventBody("dropped", wrapper, "user doesn't interact");
			}
			removeWrapper(wrapper, finalConfig.side);
		}, finalConfig.autoCloseDelay);
	}

	function stopCloseTimer() {
		clearTimeout(closeTimeout);
	}

	wrapper.addEventListener("mouseenter", stopCloseTimer);
	wrapper.addEventListener("mouseleave", startCloseTimer);
	startCloseTimer();

	// Queue + render
	queues[finalConfig.side].push(wrapper);
	processQueue(finalConfig.side);

	return wrapper;
}

/**
 * Process the queue for a given side, showing up to maxVisible items.
 * @param {"left"|"right"} side
 */
function processQueue(side) {
	const container = side === "left" ? containerLeft : containerRight;

	while (
		visible[side].length < wrapperConfig.maxVisible &&
		queues[side].length > 0
	) {
		const wrapper = queues[side].shift();
		visible[side].push(wrapper);
		container.appendChild(wrapper);
	}
}

/**
 * Remove a wrapper with exit animation.
 * @param {HTMLElement} wrapper
 * @param {"left"|"right"} side
 */
function removeWrapper(wrapper, side) {
	wrapper.style.animation = "pinglet-wrapSlideOut 0.4s forwards";
	wrapper.addEventListener(
		"animationend",
		() => {
			wrapper.remove();
			const idx = visible[side].indexOf(wrapper);
			if (idx !== -1) visible[side].splice(idx, 1);
			processQueue(side);
		},
		{ once: true },
	);
}
