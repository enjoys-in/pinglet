import { _showPopup } from "./default.js";

export function ShowTestimonials() {
	const existing = document.getElementById("pinglet-testimonials");
	if (existing) return existing;

	// Create the floating button
	const btn = document.createElement("div");
	btn.className = "pinglet-floating-btn"; // Optional, for debugging
	btn.style.position = "fixed";
	btn.style.bottom = "30px";
	btn.style.right = "30px";
	btn.style.display = "flex";
	btn.style.alignItems = "center";
	btn.style.background = "#667EEA";
	btn.style.borderRadius = "50px";
	btn.style.padding = "0";
	btn.style.cursor = "pointer";
	btn.style.boxShadow =
		"0 4px 14px 0 rgba(102, 126, 234, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05)";
	btn.style.transition = "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)";
	btn.style.overflow = "hidden";
	btn.style.width = "24px";
	btn.style.height = "24px";
	btn.style.zIndex = "1000";
	btn.style.backdropFilter = "blur(10px)";
	btn.style.border = "1px solid rgba(255, 255, 255, 0.1)";

	// Create the icon
	const icon = document.createElement("div");
	icon.textContent = "❔";
	icon.className = "icon"; // Optional
	icon.style.fontSize = "20px";
	icon.style.display = "flex";
	icon.style.alignItems = "center";
	icon.style.justifyContent = "center";
	icon.style.transition = "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)";
	icon.style.width = "24px";
	icon.style.height = "24px";
	icon.style.flexShrink = "0";
	icon.style.color = "white";

	// Create the label
	const label = document.createElement("span");
	label.textContent = "View";
	label.className = "label"; // Optional
	label.style.color = "white";
	label.style.fontWeight = "500";
	label.style.fontSize = "14px";
	label.style.marginLeft = "8px";
	label.style.marginRight = "16px";
	label.style.opacity = "0";
	label.style.transform = "translateX(-8px)";
	label.style.transition = "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)";
	label.style.whiteSpace = "nowrap";
	label.style.letterSpacing = "0.025em";

	// Append children
	btn.appendChild(icon);
	btn.appendChild(label);
	document.body.appendChild(btn);

	// Hover effect
	btn.addEventListener("mouseenter", () => {
		btn.style.width = "100px";
		btn.style.borderRadius = "28px";
		btn.style.boxShadow =
			"0 8px 25px 0 rgba(102, 126, 234, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.1)";
		btn.style.transform = "translateY(-2px)";
		label.style.opacity = "1";
		label.style.transform = "translateX(0)";
		icon.style.transform = "scale(1.05)";
	});

	btn.addEventListener("mouseleave", () => {
		btn.style.width = "40px";
		btn.style.height = "40px";
		btn.style.borderRadius = "50px";
		btn.style.boxShadow =
			"0 4px 14px 0 rgba(102, 126, 234, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05)";
		btn.style.transform = "translateY(0)";
		label.style.opacity = "0";
		label.style.transform = "translateX(-8px)";
		icon.style.transform = "scale(1)";
	});

	// Active (click) effect
	btn.addEventListener("mousedown", () => {
		btn.style.transform = "translateY(0) scale(0.98)";
		btn.style.boxShadow =
			"0 2px 8px 0 rgba(102, 126, 234, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.05)";
	});

	btn.addEventListener("mouseup", () => {
		btn.style.transform = "translateY(-2px)";
		btn.style.boxShadow =
			"0 8px 25px 0 rgba(102, 126, 234, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.1)";
	});

	// Click action
	label.addEventListener("click", () => {
		_showPopup(
			"Testimonials Error",
			"There was an error loading testimonials. Please try again later. If the issue persists, please contact support.",
			[],
			"❌",
		);
	});

	// Responsive adjustments
	const updateForMobile = () => {
		if (window.innerWidth <= 768) {
			btn.style.bottom = "16px";
			btn.style.right = "16px";
			btn.style.width = "48px";
			btn.style.height = "48px";
			icon.style.width = "48px";
			icon.style.height = "48px";
			icon.style.fontSize = "18px";
			label.style.fontSize = "13px";
			label.style.marginLeft = "6px";
			label.style.marginRight = "12px";
		} else {
			btn.style.bottom = "30px";
			btn.style.right = "30px";
			btn.style.width = "40px";
			btn.style.height = "40px";
			icon.style.width = "40px";
			icon.style.height = "40px";
			icon.style.fontSize = "20px";
			label.style.fontSize = "14px";
			label.style.marginLeft = "8px";
			label.style.marginRight = "16px";
		}
	};

	updateForMobile();
	window.addEventListener("resize", updateForMobile);
}
