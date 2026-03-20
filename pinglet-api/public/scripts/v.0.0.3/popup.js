/**
 * Pinglet SDK v0.0.3 — System Popup / Error Toast
 * Displays system messages, configuration errors, and informational popups.
 */

/** @typedef {import('./types/index.js').ButtonData} ButtonData */

import { FONT_FAMILY } from "./config.js";

/**
 * Button action handler for popup buttons.
 * @param {ButtonData} btn
 * @param {HTMLElement} toast - Parent toast element
 */
export function handleButtonAction(btn, toast) {
	switch (btn.action) {
		case "redirect":
		case "open":
			return window.open(btn.src, "_blank", "noopener,noreferrer");
		case "link":
			return window.open(btn.src);
		case "alert":
			return alert(btn.src);
		case "reload":
			return window.location.reload();
		case "event": {
			// Fire a custom DOM event on window.
			// User MUST listen for this event in their own JS file.
			// Resolves event name from: btn.event (backend) | btn.eventName (SDK) | btn.src (compat)
			const name = btn.event || btn.eventName || btn.src;
			if (!name) {
				console.warn("[Pinglet] Button action 'event' requires an event name (event, eventName, or src).");
				return;
			}
			const detail = btn.payload || btn.data || {};
			return window.dispatchEvent(
				new CustomEvent(name, { detail }),
			);
		}
		case "close":
		case "dismiss":
			return window.dispatchEvent(
				new CustomEvent("pinglet:notificationClosed", {
					detail: { contentEl: toast, reason: "user-dismiss" },
				}),
			);
		default:
			return window.open("https://pinglet.enjoys.in/docs", "_blank", "noopener,noreferrer");
	}
}

/**
 * Show a system popup toast.
 * @param {string} title - Popup title
 * @param {string} [description] - Popup description
 * @param {Array<ButtonData>} [buttons] - Action buttons
 * @param {string} [icon="⚠️"] - Icon emoji
 * @param {{ duration: number, auto_dismiss: boolean }} [options]
 * @returns {HTMLElement}
 */
export function showPopup(
	title,
	description,
	buttons = [
		{
			text: "See Docs",
			action: "redirect",
			src: "https://pinglet.enjoys.in/docs",
		},
	],
	icon = "⚠️",
	options = { duration: 5000, auto_dismiss: true },
) {
	const containerId = "pinglet-popup-container";
	let container = document.getElementById(containerId);

	if (!container) {
		container = document.createElement("div");
		container.id = containerId;
		Object.assign(container.style, {
			position: "fixed",
			bottom: "24px",
			right: "24px",
			zIndex: "9999",
			display: "flex",
			flexDirection: "column",
			gap: "4px",
			alignItems: "flex-end",
			fontFamily: FONT_FAMILY,
		});
		document.body.appendChild(container);
	}

	const toast = document.createElement("div");
	Object.assign(toast.style, {
		background: "#1f1f1f",
		color: "#fff",
		padding: "16px 20px",
		borderRadius: "12px",
		boxShadow: "0 6px 18px rgba(0, 0, 0, 0.25)",
		minWidth: "260px",
		maxWidth: "340px",
		opacity: "0",
		transform: "translateX(100%)",
		transition: "opacity 0.3s ease, transform 0.3s ease",
		display: "flex",
		flexDirection: "column",
		gap: "10px",
		fontFamily: FONT_FAMILY,
	});

	// Icon + Title row
	const headerRow = document.createElement("div");
	Object.assign(headerRow.style, {
		display: "flex",
		alignItems: "center",
		gap: "10px",
		fontSize: "16px",
		fontWeight: "600",
		fontFamily: FONT_FAMILY,
	});

	const iconEl = document.createElement("div");
	iconEl.textContent = icon;
	const titleEl = document.createElement("div");
	titleEl.textContent = title;
	headerRow.append(iconEl, titleEl);
	toast.appendChild(headerRow);

	// Description
	if (description) {
		const descEl = document.createElement("div");
		descEl.textContent = description;
		Object.assign(descEl.style, {
			fontSize: "13.5px",
			fontWeight: "400",
			color: "#ddd",
			lineHeight: "1.5",
		});
		toast.appendChild(descEl);
	}

	// Buttons
	if (Array.isArray(buttons) && buttons.length) {
		const btnRow = document.createElement("div");
		Object.assign(btnRow.style, {
			marginTop: "8px",
			display: "flex",
			gap: "10px",
			justifyContent: "flex-start",
		});

		for (const btn of buttons) {
			const btnEl = document.createElement("button");
			btnEl.textContent = btn.text || "Click Here";
			Object.assign(btnEl.style, {
				padding: "8px 14px",
				background: "#333",
				color: "#fff",
				border: "1px solid #444",
				borderRadius: "6px",
				fontSize: "13px",
				cursor: "pointer",
				transition: "background 0.3s",
				fontFamily: FONT_FAMILY,
			});
			btnEl.onmouseover = () => (btnEl.style.background = "#444");
			btnEl.onmouseout = () => (btnEl.style.background = "#333");

			if (btn?.onClick) {
				try {
					const func = new Function(`return ${btn.onClick}`)();
					if (typeof func === "function") {
						btnEl.addEventListener("click", func);
					}
				} catch (e) {
					console.warn("[Pinglet] Invalid onClick handler:", e);
				}
			} else {
				btnEl.addEventListener("click", (e) => {
					e.stopPropagation();
					handleButtonAction(btn, toast);
				});
			}
			btnRow.appendChild(btnEl);
		}
		toast.appendChild(btnRow);
	}

	// Footer
	const footer = document.createElement("div");
	footer.innerHTML =
		'Notifications by <a href="https://pinglet.enjoys.in" target="_blank" rel="noopener noreferrer" style="color:#4da6ff;text-decoration:none;">Pinglet</a> - Enjoys';
	Object.assign(footer.style, {
		fontSize: "11px",
		color: "#999",
		marginTop: "4px",
		textAlign: "right",
		fontFamily: FONT_FAMILY,
	});

	container.appendChild(toast);
	container.appendChild(footer);

	// Animate in
	requestAnimationFrame(() => {
		toast.style.opacity = "1";
		toast.style.transform = "translateX(0)";
	});

	// Auto-dismiss
	if (options.auto_dismiss !== false) {
		setTimeout(() => {
			toast.style.opacity = "0";
			toast.style.transform = "translateX(100%)";
			setTimeout(() => {
				toast.remove();
				footer.remove();
			}, 500);
		}, options.duration || 5000);
	}

	return container;
}
