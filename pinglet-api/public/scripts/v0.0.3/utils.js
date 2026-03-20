/**
 * Pinglet SDK v0.0.3 — Shared Utilities
 * Common helper functions used across all SDK modules.
 */

/**
 * Inject a Google Font and apply it to all .pinglet-* elements.
 * @param {string} [fontFamily="Manrope"] - Font family to inject
 */
export function injectFont(fontFamily = "Manrope") {
	if (document.getElementById("pinglet-font-link")) return;

	const fontLink = document.createElement("link");
	fontLink.id = "pinglet-font-link";
	fontLink.rel = "stylesheet";
	fontLink.href = `https://fonts.googleapis.com/css2?family=${fontFamily}:wght@200..800&display=swap`;
	document.head.appendChild(fontLink);

	const fontStyle = document.createElement("style");
	fontStyle.id = "pinglet-font-style";
	fontStyle.textContent = `
[class^="pinglet-"],
[class*=" pinglet-"] {
  font-family: '${fontFamily}', sans-serif !important;
  font-weight: 400 !important;
}`;
	document.head.appendChild(fontStyle);
}

/**
 * Escape text content to prevent XSS.
 * @param {string} str - Raw string
 * @returns {string} Escaped HTML-safe string
 */
export function escapeHtml(str) {
	if (!str) return "";
	const div = document.createElement("div");
	div.textContent = str;
	return div.innerHTML;
}

/**
 * Sanitize a URL — only allow http(s) protocols.
 * @param {string} url - URL to sanitize
 * @returns {string} Safe URL or empty string
 */
export function safeUrl(url) {
	if (!url) return "";
	try {
		const u = new URL(url, window.location.origin);
		if (u.protocol === "http:" || u.protocol === "https:") return u.href;
	} catch (_) {}
	return "";
}

/**
 * Convert a unix timestamp to a relative time string.
 * @param {number} ts - Unix timestamp in milliseconds
 * @returns {string} Relative time (e.g., "2m ago")
 */
export function relativeTime(ts) {
	if (!ts) return "";
	const diff = Date.now() - ts;
	if (diff < 5000) return "now";
	if (diff < 60000) return Math.floor(diff / 1000) + "s ago";
	if (diff < 3600000) return Math.floor(diff / 60000) + "m ago";
	if (diff < 86400000) return Math.floor(diff / 3600000) + "h ago";
	return Math.floor(diff / 86400000) + "d ago";
}

/**
 * Generate a unique key for notification dedup/tracking.
 * @returns {string}
 */
export function uniqueKey() {
	return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Detect if the user prefers dark mode.
 * @param {"light"|"dark"|"auto"} [mode="auto"] - Theme mode
 * @returns {boolean}
 */
export function isDarkMode(mode = "auto") {
	if (mode === "dark") return true;
	if (mode === "light") return false;
	return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

/**
 * Read the SDK script element's data attributes.
 * Finds the <script> tag containing "pinglet-sse" in its src.
 * @returns {{ endpoint: string, configuredDomain: string, projectId: string, pingletId: string, checksum: string, testimonials: string, templatesIds: string }}
 */
export function getScriptConfig() {
	const scriptEl = Array.from(document.scripts).find(
		(s) => s.src.includes("pinglet-sse") && s.dataset.endpoint,
	);
	const el = scriptEl || document.currentScript;
	return {
		endpoint: el?.dataset.endpoint || "",
		configuredDomain: el?.dataset.configuredDomain || "",
		projectId: el?.dataset.projectId || "",
		pingletId: el?.dataset.pingletId || "",
		checksum: el?.dataset.checksum || "",
		testimonials: el?.dataset.testimonials === "true",
		templatesIds: el?.dataset.templates || "",
	};
}
