// widget.js

let container;
let branding;
let soundPlayer;

export function initWidget(globalConfig) {
	container = document.createElement("div");
	container.id = "pinglet-wrapper";
	container.style = `position:fixed;${
		globalConfig.position.includes("bottom") ? "bottom" : "top"
	}:0;left:0;right:0;z-index:999999;font-family:sans-serif`;

	const widgetArea = document.createElement("div");
	widgetArea.className = "pinglet-container";
	container.appendChild(widgetArea);

	// Branding
	branding = document.createElement("div");
	branding.className = "pinglet-branding";
	branding.innerHTML = globalConfig.branding?.html || "";
	branding.style = "text-align:center;padding:5px;font-size:12px;color:#999";
	container.appendChild(branding);

	// Sound
	if (globalConfig.sound?.play && globalConfig.sound.src) {
		soundPlayer = new Audio(globalConfig.sound.src);
	}

	document.body.appendChild(container);
}

export function renderToast(contentEl, config = {}) {
	const toast = document.createElement("div");
	toast.className = "pinglet-toast";
	toast.appendChild(contentEl);

	applyTransition(toast, config.transition);

	const container = document.querySelector(
		"#pinglet-wrapper .pinglet-container",
	);
	container.appendChild(toast);

	if (config.sound?.play) soundPlayer?.play();

	if (config.auto_dismiss) {
		setTimeout(() => {
			toast.remove();
		}, config.duration || 3000);
	}
}

function applyTransition(el, type) {
	if (type === "fade") {
		el.style.opacity = 0;
		el.style.transition = "opacity 0.5s ease";
		requestAnimationFrame(() => (el.style.opacity = 1));
	}
}
