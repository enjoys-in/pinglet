/**
 * Pinglet SDK v0.0.3 — Notification Variant Builder
 * Creates rich notification cards (type 0) with media, buttons, and dark mode support.
 */

/** @typedef {import('./types/index.js').GlobalConfig} GlobalConfig */
/** @typedef {import('./types/index.js').NotificationBody} NotificationBody */
/** @typedef {import('./types/index.js').MediaData} MediaData */

import { audioPlayerElement } from "./audio-player.js";
import { defaultConfig, defaultStyles } from "./config.js";
import { fireCustomEvent } from "./events.js";
import { handleButtonAction } from "./popup.js";
import { brandingElement, playSound, toastStack } from "./toast.js";
import { isDarkMode, uniqueKey } from "./utils.js";

// ─── Header ───

/**
 * Create a notification header with domain, time, and close button.
 * @param {import('./types/index.js').ProjectConfig} [config]
 * @param {string} [domain]
 * @param {string} [time]
 * @param {boolean} [dark]
 * @returns {HTMLDivElement}
 */
function createHeader(config = defaultConfig, domain = window.location.hostname, time = "just now", dark = false) {
	const row = document.createElement("div");
	row.className = "pinglet-row";
	Object.assign(row.style, {
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
		background: dark ? "#1a1a1a" : "transparent",
		fontFamily: "system-ui, sans-serif",
		fontSize: "10px",
		padding: "6px 10px",
		borderBottom: dark
			? "1px solid rgba(255, 255, 255, 0.1)"
			: "1px solid rgba(0, 0, 0, 0.05)",
		color: dark ? "#f0f0f0" : "#000",
	});

	const left = document.createElement("div");
	left.className = "pinglet-left";
	Object.assign(left.style, {
		display: "flex",
		alignItems: "center",
		gap: "6px",
		flexGrow: "1",
	});

	const pingletIcon = document.createElement("span");
	pingletIcon.className = "pinglet-icon";
	pingletIcon.textContent = "- Pinglet";
	pingletIcon.onclick = () => window.open("https://pinglet.enjoys.in", "_blank", "noopener,noreferrer");
	Object.assign(pingletIcon.style, {
		color: "dodgerblue",
		flexShrink: "0",
		fontWeight: "bold",
		cursor: "pointer",
	});

	const domainText = document.createElement("span");
	domainText.className = "pinglet-domain";
	domainText.textContent = domain;
	domainText.style.color = dark ? "#bbb" : "#808080";

	const timeText = document.createElement("span");
	timeText.className = "pinglet-time";
	timeText.textContent = `- ${time}`;
	timeText.style.color = dark ? "#ccc" : "#aaa";

	const closeBtn = document.createElement("button");
	closeBtn.className = "pinglet-close";
	closeBtn.textContent = "✕";
	Object.assign(closeBtn.style, {
		background: "none",
		border: "none",
		fontSize: "12px",
		cursor: "pointer",
		color: dark ? "#aaa" : "#888",
		padding: "0 4px",
	});
	closeBtn.addEventListener("mouseenter", () => (closeBtn.style.color = "#f44"));
	closeBtn.addEventListener("mouseleave", () => (closeBtn.style.color = dark ? "#aaa" : "#888"));

	if (config?.website) left.appendChild(domainText);
	if (config?.time) left.appendChild(timeText);
	if (config?.favicon) left.appendChild(pingletIcon);
	row.appendChild(left);

	if (config?.dismissible) {
		row.appendChild(closeBtn);
		closeBtn.addEventListener("click", (e) => {
			e.stopPropagation();
			fireCustomEvent("pinglet:notificationClosed", {
				contentEl: closeBtn.parentElement?.parentElement,
				reason: "user-dismiss",
			});
			if (toastStack && toastStack.children.length === 0) {
				brandingElement?.remove();
			}
		});
	}

	return row;
}

// ─── Media Element Builder ───

/**
 * Create a media element from data.
 * @param {MediaData} media
 * @param {Object} style - Style config
 * @param {Object} controls - Controls config
 * @returns {HTMLElement|null}
 */
function createMediaElement(media, style, controls) {
	switch (media.type) {
		case "image": {
			const img = document.createElement("img");
			img.src = media.src;
			Object.assign(img.style, style?.image || defaultStyles.media.image);
			return img;
		}
		case "video": {
			const video = document.createElement("video");
			video.src = media.src;
			const ctrl = controls?.video || defaultStyles.controls.video;
			video.autoplay = ctrl.autoplay;
			video.muted = ctrl.muted;
			video.loop = ctrl.loop;
			video.controls = ctrl.controls;
			video.playsInline = true;
			Object.assign(video.style, style?.video || defaultStyles.media.video);
			return video;
		}
		case "audio": {
			const ctrl = controls?.audio || defaultStyles.controls.audio;
			return audioPlayerElement(media.src, ctrl.muted, ctrl.loop, ctrl.controls);
		}
		case "iframe": {
			const iframe = document.createElement("iframe");
			iframe.src = media.src;
			iframe.setAttribute("sandbox", "allow-scripts allow-same-origin");
			iframe.loading = "lazy";
			Object.assign(iframe.style, style?.iframe || defaultStyles.media.iframe);
			return iframe;
		}
		default:
			return null;
	}
}

/**
 * Create an icon or logo element.
 * @param {"icon"|"logo"} type
 * @param {string} src
 * @param {Object} style
 * @returns {HTMLElement|null}
 */
function createIconElement(type, src, style) {
	if (!src) return null;
	const img = document.createElement("img");
	img.src = src;
	img.alt = type;
	Object.assign(img.style, {
		width: type === "icon" ? "36px" : "48px",
		height: type === "icon" ? "36px" : "48px",
		borderRadius: type === "icon" ? "50%" : "8px",
		objectFit: "cover",
		flexShrink: "0",
	});
	return img;
}

// ─── Main Export ───

/**
 * Create a notification variant element.
 * @param {NotificationBody} data - Notification body data
 * @param {GlobalConfig} config - Global configuration
 * @returns {HTMLElement}
 */
export function createVariant(data, config) {
	const globalStyle = config.style;
	const globalConfig = config.config;
	const dark = isDarkMode(globalConfig.theme?.mode);

	const wrapper = document.createElement("div");
	wrapper.id = "pinglet-variant";
	wrapper.setAttribute("data-key", uniqueKey());
	wrapper.className = `pinglet-variant pinglet-${data.variant || "default"}`;
	Object.assign(wrapper.style, {
		display: "flex",
		flexDirection: "column",
		alignItems: "stretch",
		width: "320px",
		maxHeight: "calc(100vh - 40px)",
		borderRadius: "8px",
		overflowY: "auto",
		padding: "4px",
		gap: "4px",
		pointerEvents: "none",
		overflow: "visible",
		flexShrink: "0",
		boxShadow: dark ? "0 2px 8px rgba(0,0,0,0.6)" : "0 2px 8px rgba(0,0,0,0.1)",
		backgroundColor: dark ? "#1e1e1e" : "whitesmoke",
		color: dark ? "#f0f0f0" : "#000",
	});

	// Header
	wrapper.appendChild(createHeader(globalConfig, window.location.hostname, "just now", dark));

	// Media (full-width)
	if (data.media?.type) {
		const mediaEl = createMediaElement(data.media, globalStyle.media, globalStyle.controls);
		if (mediaEl) {
			mediaEl.style.marginBottom = "12px";
			wrapper.appendChild(mediaEl);
		}
	}

	// Inline icon/logo + text
	const hasInlineMedia = "icon" in data || "logo" in data;

	if (hasInlineMedia) {
		const flexWrapper = document.createElement("div");
		Object.assign(flexWrapper.style, {
			display: "flex",
			flexDirection: "row",
			alignItems: "flex-start",
			gap: "6px",
		});

		const iconType = "icon" in data ? "icon" : "logo";
		const iconSrc = data?.icon || data?.logo;
		const iconEl = createIconElement(iconType, iconSrc, globalStyle.media);
		if (iconEl) {
			const iconDiv = document.createElement("div");
			iconDiv.style.flex = "0 0 auto";
			iconDiv.appendChild(iconEl);
			flexWrapper.appendChild(iconDiv);
		}

		const textDiv = document.createElement("div");
		Object.assign(textDiv.style, { display: "flex", flexDirection: "column", flex: "1" });
		appendTextContent(textDiv, data, globalStyle, dark);
		flexWrapper.appendChild(textDiv);
		wrapper.appendChild(flexWrapper);
	} else {
		appendTextContent(wrapper, data, globalStyle, dark);
	}

	// Buttons
	if (data.buttons?.length) {
		const btnWrap = document.createElement("div");
		btnWrap.className = "pinglet-buttons";
		btnWrap.style.fontFamily = "Manrope";

		data.buttons.forEach((btn, i) => {
			const btnEl = document.createElement("button");
			btnEl.textContent = btn.text;
			btnEl.className = "pinglet-btn";
			Object.assign(btnEl.style, {
				cursor: "pointer",
				padding: "6px 10px",
				fontFamily: "Manrope, sans-serif",
				margin: "1px 4px",
				color: dark ? "#f0f0f0" : "#000",
				backgroundColor: dark ? "#333" : "#f0f0f0",
				border: "none",
				borderRadius: "4px",
			});
			Object.assign(btnEl.style, i === 0 ? globalStyle.btn1 : globalStyle.btn2);

			if (btn?.onClick) {
				try {
					const func = new Function(`return ${btn.onClick}`)();
					if (typeof func === "function") btnEl.addEventListener("click", func);
				} catch (e) {
					console.warn("[Pinglet] Invalid onClick handler:", e);
				}
			} else {
				btnEl.addEventListener("click", (e) => {
					e.stopPropagation();
					handleButtonAction(btn, wrapper);
				});
			}
			btnWrap.appendChild(btnEl);
		});
		wrapper.appendChild(btnWrap);
	}

	// Sound
	if (globalConfig.sound?.play) playSound();

	// Branding
	if (brandingElement && !wrapper.contains(brandingElement) && !globalConfig.branding?.once) {
		wrapper.appendChild(brandingElement);
	}

	return wrapper;
}

/**
 * Append title and description text to a container.
 * @param {HTMLElement} container
 * @param {NotificationBody} data
 * @param {import('./types/index.js').TemplateStyleConfig} style
 * @param {boolean} dark
 */
function appendTextContent(container, data, style, dark) {
	if (data.title) {
		const title = document.createElement("div");
		title.className = "pinglet-title";
		title.textContent = data.title;
		Object.assign(title.style, {
			...(style.title || defaultStyles.title),
			color: dark ? "#ffffff" : "#000000",
		});
		container.appendChild(title);
	}

	if (data.description) {
		const desc = document.createElement("p");
		desc.className = "pinglet-desc";
		desc.textContent = data.description;
		Object.assign(desc.style, {
			...(style.description || defaultStyles.description),
			color: dark ? "#dddddd" : "#333333",
		});
		container.appendChild(desc);
	}
}
