/**
 * Pinglet SDK v0.0.3 — Testimonials Floating Button
 * Displays a floating "View" button with hover expand animation.
 */

import { showPopup } from "./popup.js";

/**
 * Show the testimonials floating button.
 * @returns {HTMLDivElement|null} The button element
 */
export function showTestimonials() {
	if (document.getElementById("pinglet-testimonials")) return null;

	const btn = document.createElement("div");
	btn.id = "pinglet-testimonials";
	btn.className = "pinglet-floating-btn";
	Object.assign(btn.style, {
		position: "fixed",
		bottom: "30px",
		right: "30px",
		display: "flex",
		alignItems: "center",
		background: "#667EEA",
		borderRadius: "50px",
		padding: "0",
		cursor: "pointer",
		boxShadow: "0 4px 14px 0 rgba(102, 126, 234, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05)",
		transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
		overflow: "hidden",
		width: "40px",
		height: "40px",
		zIndex: "1000",
		backdropFilter: "blur(10px)",
		border: "1px solid rgba(255, 255, 255, 0.1)",
	});

	const icon = document.createElement("div");
	icon.textContent = "❔";
	Object.assign(icon.style, {
		fontSize: "20px",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
		width: "40px",
		height: "40px",
		flexShrink: "0",
		color: "white",
	});

	const label = document.createElement("span");
	label.textContent = "View";
	Object.assign(label.style, {
		color: "white",
		fontWeight: "500",
		fontSize: "14px",
		marginLeft: "8px",
		marginRight: "16px",
		opacity: "0",
		transform: "translateX(-8px)",
		transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
		whiteSpace: "nowrap",
		letterSpacing: "0.025em",
	});

	btn.append(icon, label);
	document.body.appendChild(btn);

	// Hover expand
	btn.addEventListener("mouseenter", () => {
		btn.style.width = "100px";
		btn.style.borderRadius = "28px";
		btn.style.boxShadow = "0 8px 25px 0 rgba(102, 126, 234, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.1)";
		btn.style.transform = "translateY(-2px)";
		label.style.opacity = "1";
		label.style.transform = "translateX(0)";
		icon.style.transform = "scale(1.05)";
	});

	btn.addEventListener("mouseleave", () => {
		btn.style.width = "40px";
		btn.style.height = "40px";
		btn.style.borderRadius = "50px";
		btn.style.boxShadow = "0 4px 14px 0 rgba(102, 126, 234, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05)";
		btn.style.transform = "translateY(0)";
		label.style.opacity = "0";
		label.style.transform = "translateX(-8px)";
		icon.style.transform = "scale(1)";
	});

	btn.addEventListener("mousedown", () => {
		btn.style.transform = "translateY(0) scale(0.98)";
	});

	btn.addEventListener("mouseup", () => {
		btn.style.transform = "translateY(-2px)";
	});

	label.addEventListener("click", () => {
		showPopup(
			"Testimonials Error",
			"There was an error loading testimonials. Please try again later.",
			[],
			"❌",
		);
	});

	// Responsive
	const updateForMobile = () => {
		if (window.innerWidth <= 768) {
			Object.assign(btn.style, { bottom: "16px", right: "16px", width: "48px", height: "48px" });
			Object.assign(icon.style, { width: "48px", height: "48px", fontSize: "18px" });
		} else {
			Object.assign(btn.style, { bottom: "30px", right: "30px", width: "40px", height: "40px" });
			Object.assign(icon.style, { width: "40px", height: "40px", fontSize: "20px" });
		}
	};
	updateForMobile();
	window.addEventListener("resize", updateForMobile);

	return btn;
}
