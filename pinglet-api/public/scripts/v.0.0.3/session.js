/**
 * Pinglet SDK v0.0.3 — Session Recording
 * Uses rrweb (if loaded) to record masked DOM events.
 * Sends session data to backend on page unload.
 * Fixed: uses dynamic endpoint (was hardcoded "/track-session" in v0.0.2).
 */

const rrwebURL = "https://cdn.jsdelivr.net/npm/rrweb@latest/dist/rrweb.min.js";
const events = [];

/**
 * Resolve the session tracking endpoint.
 * @returns {string}
 */
function getSessionEndpoint() {
	const script = Array.from(document.scripts).find(
		(s) => s.src.includes("pinglet-sse") && s.dataset.endpoint,
	);
	return script?.dataset.endpoint ? `${script.dataset.endpoint}/track-session` : "/track-session";
}

// Start recording if rrweb is available
if (typeof rrweb !== "undefined" && rrweb.record) {
	rrweb.record({
		maskAllInputs: true,
		maskInputOptions: {
			password: true,
			email: true,
			textarea: true,
		},
		emit(event) {
			events.push(event);
		},
	});
} else {
	console.warn("[Pinglet] rrweb is not loaded. Session recording disabled. Load it from:", rrwebURL);
}

// Send events on unload
window.addEventListener("beforeunload", () => {
	if (events.length === 0) return;
	const endpoint = getSessionEndpoint();
	navigator.sendBeacon(endpoint, JSON.stringify(events));
});
