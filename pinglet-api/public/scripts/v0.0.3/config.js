/**
 * Pinglet SDK v0.0.3 — Default Configuration & Styles
 * Central source of truth for all default config values and style presets.
 */

/** @typedef {import('./types/index.js').ProjectConfig} ProjectConfig */
/** @typedef {import('./types/index.js').TemplateStyleConfig} TemplateStyleConfig */

/** @type {ProjectConfig} */
export const defaultConfig = {
	position: "bottom-left",
	transition: "fade",
	duration: 5000,
	maxVisible: 3,
	stacking: true,
	auto_dismiss: true,
	dismissible: true,
	website: true,
	favicon: true,
	time: true,
	sound: {
		play: false,
		src: "",
		volume: 0.5,
	},
	theme: {
		mode: "auto",
		customClass: "",
		rounded: true,
		shadow: true,
		border: false,
	},
	branding: {
		show: true,
		once: true,
		html: "",
	},
	progressBar: {
		show: true,
		color: "",
	},
};

/** @type {TemplateStyleConfig} */
export const defaultStyles = {
	duration: 3000,
	btn1: {
		color: "#ffffff",
		backgroundColor: "#007bff",
		padding: "6px 10px",
		borderRadius: "6px",
		fontSize: "14px",
		fontWeight: "600",
		border: "none",
		boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
	},
	btn2: {
		color: "#333333",
		backgroundColor: "#f0f0f0",
		padding: "6px 10px",
		borderRadius: "6px",
		fontSize: "14px",
		fontWeight: "600",
		border: "1px solid #ccc",
	},
	title: {
		color: "#111111",
		fontSize: "14px",
		fontWeight: "500",
		lineHeight: "1.4",
		margin: "0",
		textAlign: "left",
	},
	description: {
		color: "#444444",
		fontSize: "13px",
		fontWeight: "400",
		lineHeight: "1.5",
		margin: "0 0 10px 0",
		textAlign: "left",
	},
	controls: {
		video: { autoplay: false, muted: false, loop: false, controls: true },
		audio: { autoplay: false, muted: false, loop: false, controls: true },
	},
	media: {
		image: {
			width: "100%",
			borderRadius: "8px",
			objectFit: "cover",
			maxHeight: "200px",
		},
		video: {
			width: "100%",
			borderRadius: "8px",
			maxHeight: "200px",
		},
		audio: {
			width: "100%",
		},
		iframe: {
			width: "100%",
			borderRadius: "8px",
			height: "180px",
			border: "none",
		},
	},
};

/** SDK version — must match backend expected version */
export const SDK_VERSION = "1.3.0";

/** Font family used across all Pinglet UI */
export const FONT_FAMILY = "'Manrope', sans-serif";
