/**
 * Pinglet SDK v0.0.3 — Anonymous Activity Tracker
 * Tracks page views, clicks, scroll depth, visibility changes, UTM params,
 * and performance metrics. Posts everything to /log/track.
 */

let _endpoint = "";
let _projectId = "";
const _startTime = Date.now();

/**
 * Initialize activity tracking. Call once after config is loaded.
 * @param {string} endpoint - API base URL
 * @param {string} projectId - Project ID
 */
export function initActivity(endpoint, projectId) {
	if (_endpoint) return; // already initialized
	_endpoint = endpoint;
	_projectId = projectId;
	_bindListeners();
}

// ─── Internals ───

function _getAnonId() {
	let id = localStorage.getItem("pinglet_anon_id");
	if (!id) {
		id = crypto.randomUUID();
		localStorage.setItem("pinglet_anon_id", id);
	}
	return id;
}

function _getUTM() {
	const p = new URLSearchParams(window.location.search);
	return { utm_source: p.get("utm_source"), utm_medium: p.get("utm_medium"), utm_campaign: p.get("utm_campaign") };
}

function _getFingerprint() {
	const str = navigator.userAgent + navigator.language + screen.width + screen.height + (navigator.platform || "");
	return crypto.subtle
		.digest("SHA-256", new TextEncoder().encode(str))
		.then((buf) => [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join(""));
}

function _send(payload) {
	if (!_endpoint) return;
	const url = `${_endpoint}/log/track`;
	const body = JSON.stringify(payload);
	if (navigator.sendBeacon) {
		navigator.sendBeacon(url, new Blob([body], { type: "application/json" }));
	} else {
		fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body, credentials: "omit" }).catch(() => {});
	}
}

function _getPerf() {
	const p = performance.timing;
	return {
		loadTime: p.loadEventEnd - p.navigationStart,
		domContentLoaded: p.domContentLoadedEventEnd - p.navigationStart,
		timeToFirstByte: p.responseStart - p.requestStart,
	};
}

function _track(type, extra = {}) {
	if (!_projectId) return;
	_getFingerprint().then((fingerprint) => {
		_send({
			event: "activity",
			eventType: type,
			project_id: _projectId,
			anonId: _getAnonId(),
			fingerprint,
			timestamp: new Date().toISOString(),
			page: { url: location.href, referrer: document.referrer, title: document.title },
			browser: {
				userAgent: navigator.userAgent,
				language: navigator.language,
				platform: navigator.platform || "",
				screen: { width: screen.width, height: screen.height, colorDepth: screen.colorDepth },
				timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
			},
			utm: _getUTM(),
			...extra,
		});
	});
}

// ─── Event Listeners ───

let _maxScroll = 0;

function _bindListeners() {
	window.addEventListener("scroll", () => {
		const pct = Math.floor(((window.scrollY + window.innerHeight) / document.documentElement.scrollHeight) * 100);
		if (pct > _maxScroll) _maxScroll = pct;
	});

	window.addEventListener("beforeunload", () => {
		_track("page_exit", { scrollDepth: _maxScroll, sessionTime: Date.now() - _startTime });
	});

	window.addEventListener("load", () => {
		_track("page_view", { performance: _getPerf() });
	});

	document.addEventListener("click", (e) => {
		const t = /** @type {HTMLElement} */ (e.target);
		if (t.tagName === "A" || t.tagName === "BUTTON") {
			_track("click", {
				element: {
					tag: t.tagName,
					text: (t.textContent || "").slice(0, 100),
					href: /** @type {any} */ (t).href || "",
					id: t.id || "",
					className: (t.className || "").toString().slice(0, 100),
				},
			});
		}
	});
}

