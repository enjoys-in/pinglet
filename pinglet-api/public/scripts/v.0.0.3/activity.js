/**
 * Pinglet SDK v0.0.3 — Anonymous Activity Tracker
 * Tracks page views, clicks, scroll depth, visibility changes, UTM params,
 * and performance metrics. Uses dynamic endpoint (no hardcoded URLs).
 */

(function () {
	const startTime = Date.now();

	/**
	 * Resolve the tracking endpoint from the script tag.
	 * @returns {string}
	 */
	function getTrackingEndpoint() {
		const script = Array.from(document.scripts).find(
			(s) => s.src.includes("pinglet-sse") && s.dataset.endpoint,
		);
		const base = script?.dataset.endpoint || "";
		return base ? `${base}/log/track` : "";
	}

	/**
	 * Get or create a persistent anonymous user ID.
	 * @returns {string}
	 */
	function getAnonUserId() {
		let id = localStorage.getItem("pinglet_anon_id");
		if (!id) {
			id = crypto.randomUUID();
			localStorage.setItem("pinglet_anon_id", id);
		}
		return id;
	}

	/**
	 * Extract UTM parameters from the current URL.
	 * @returns {{ utm_source: string|null, utm_medium: string|null, utm_campaign: string|null }}
	 */
	function getUTMParams() {
		const params = new URLSearchParams(window.location.search);
		return {
			utm_source: params.get("utm_source"),
			utm_medium: params.get("utm_medium"),
			utm_campaign: params.get("utm_campaign"),
		};
	}

	/**
	 * Generate a SHA-256 fingerprint from basic browser properties.
	 * @returns {Promise<string>}
	 */
	function getFingerprint() {
		const str =
			navigator.userAgent +
			navigator.language +
			screen.width +
			screen.height +
			navigator.platform;
		return crypto.subtle
			.digest("SHA-256", new TextEncoder().encode(str))
			.then((buf) =>
				[...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join(""),
			);
	}

	/**
	 * Send analytics payload to backend.
	 * @param {Object} payload
	 */
	function sendAnalytics(payload) {
		const endpoint = getTrackingEndpoint();
		if (!endpoint) return;
		const body = JSON.stringify(payload);
		if (navigator.sendBeacon) {
			navigator.sendBeacon(endpoint, body);
		} else {
			fetch(endpoint, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body,
				credentials: "omit",
			}).catch(() => {});
		}
	}

	/**
	 * Get performance timing metrics.
	 * @returns {{ loadTime: number, domContentLoaded: number, timeToFirstByte: number }}
	 */
	function getPerformanceMetrics() {
		const perf = performance.timing;
		return {
			loadTime: perf.loadEventEnd - perf.navigationStart,
			domContentLoaded: perf.domContentLoadedEventEnd - perf.navigationStart,
			timeToFirstByte: perf.responseStart - perf.requestStart,
		};
	}

	/**
	 * Track an event with full context.
	 * @param {string} type - Event type
	 * @param {Object} [extraData] - Additional data
	 */
	function trackEvent(type, extraData = {}) {
		getFingerprint().then((fingerprint) => {
			sendAnalytics({
				eventType: type,
				anonId: getAnonUserId(),
				fingerprint,
				timestamp: new Date().toISOString(),
				page: {
					url: location.href,
					referrer: document.referrer,
					title: document.title,
				},
				browser: {
					userAgent: navigator.userAgent,
					language: navigator.language,
					platform: navigator.platform,
					screen: {
						width: screen.width,
						height: screen.height,
						colorDepth: screen.colorDepth,
					},
					timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
				},
				utm: getUTMParams(),
				...extraData,
			});
		});
	}

	// ─── Scroll Depth Tracking ───

	let maxScroll = 0;
	window.addEventListener("scroll", () => {
		const scrollPercent = Math.floor(
			((window.scrollY + window.innerHeight) /
				document.documentElement.scrollHeight) *
				100,
		);
		if (scrollPercent > maxScroll) maxScroll = scrollPercent;
	});

	window.addEventListener("beforeunload", () => {
		trackEvent("page_exit", {
			scrollDepth: maxScroll,
			sessionTime: Date.now() - startTime,
		});
	});

	// ─── Visibility Change ───

	document.addEventListener("visibilitychange", () => {
		trackEvent("visibility_change", { visibility: document.visibilityState });
	});

	// ─── Page View on Load ───

	window.addEventListener("load", () => {
		trackEvent("page_view", {
			performance: getPerformanceMetrics(),
		});
	});

	// ─── Click Tracking ───

	document.addEventListener("click", (e) => {
		const target = e.target;
		if (target.tagName === "A" || target.tagName === "BUTTON") {
			trackEvent("click", {
				element: {
					tag: target.tagName,
					text: (target.textContent || "").slice(0, 100),
					href: target.href || "",
					id: target.id || "",
					className: (target.className || "").slice(0, 100),
				},
			});
		}
	});
})();
