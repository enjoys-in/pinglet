/**
 * Pinglet SDK v0.0.3 — Session Recording
 * Uses rrweb (if loaded) to record masked DOM events.
 * Sends session data to /log/track on page unload.
 */

let _endpoint = "";
let _projectId = "";
const _events = [];
const _rrwebURL = "https://cdn.jsdelivr.net/npm/rrweb@latest/dist/rrweb.min.js";

/**
 * Initialize session recording. Call once after config is loaded.
 * @param {string} endpoint - API base URL
 * @param {string} projectId - Project ID
 */
export function initSessionRecording(endpoint, projectId) {
	if (_endpoint) return;
	_endpoint = endpoint;
	_projectId = projectId;

	if (typeof rrweb !== "undefined" && rrweb.record) {
		rrweb.record({
			maskAllInputs: true,
			maskInputOptions: { password: true, email: true, textarea: true },
			emit(event) {
				_events.push(event);
			},
		});
	} else {
		console.warn("[Pinglet] rrweb not loaded. Session recording disabled. Load from:", _rrwebURL);
		return;
	}

	const anonId = localStorage.getItem("pinglet_anon_id") || crypto.randomUUID();

	window.addEventListener("beforeunload", () => {
		if (_events.length === 0) return;
		const url = `${_endpoint}/log/track`;
		const body = JSON.stringify({
			event: "session_recording",
			project_id: _projectId,
			visitor_id: anonId,
			events: _events,
			page_url: location.href,
			duration_ms: _events.length > 1 ? _events[_events.length - 1].timestamp - _events[0].timestamp : 0,
			event_count: _events.length,
			timestamp: new Date().toISOString(),
		});
		navigator.sendBeacon(url, body);
	});
}
