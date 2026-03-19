(() => {
	const API_ENDPOINT = "https://pinglet.enjoys.in/api/v1/log/track"; // Change to your backend

	// Generate or retrieve a persistent anonymous user ID
	function getAnonUserId() {
		let id = localStorage.getItem("anon_user_id");
		if (!id) {
			id = crypto.randomUUID();
			localStorage.setItem("anon_user_id", id);
		}
		return id;
	}

	// Get UTM parameters from URL
	function getUTMParams() {
		const urlParams = new URLSearchParams(window.location.search);
		return {
			utm_source: urlParams.get("utm_source"),
			utm_medium: urlParams.get("utm_medium"),
			utm_campaign: urlParams.get("utm_campaign"),
		};
	}

	// Get basic fingerprint info (anonymized)
	function getFingerprint() {
		const str =
			navigator.userAgent +
			navigator.language +
			screen.width +
			screen.height +
			navigator.platform;
		const encoder = new TextEncoder();
		return crypto.subtle
			.digest("SHA-256", encoder.encode(str))
			.then((hashBuffer) => {
				return [...new Uint8Array(hashBuffer)]
					.map((b) => b.toString(16).padStart(2, "0"))
					.join("");
			});
	}

	// Send data to your backend
	function sendAnalytics(payload) {
		navigator.sendBeacon?.(API_ENDPOINT, JSON.stringify(payload)) ||
			fetch(API_ENDPOINT, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
				credentials: "omit",
			});
	}

	// Track performance metrics
	function getPerformanceMetrics() {
		const perf = performance.timing;
		return {
			loadTime: perf.loadEventEnd - perf.navigationStart,
			domContentLoaded: perf.domContentLoadedEventEnd - perf.navigationStart,
			timeToFirstByte: perf.responseStart - perf.requestStart,
		};
	}

	// Main track event
	function trackEvent(type, extraData = {}) {
		getFingerprint().then((fingerprint) => {
			const data = {
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
			};

			sendAnalytics(data);
		});
	}

	// Track scroll depth
	function trackScrollDepth() {
		let maxScroll = 0;
		window.addEventListener("scroll", () => {
			const scrollPercent = Math.floor(
				((window.scrollY + window.innerHeight) /
					document.documentElement.scrollHeight) *
					100,
			);
			if (scrollPercent > maxScroll) {
				maxScroll = scrollPercent;
			}
		});

		window.addEventListener("beforeunload", () => {
			trackEvent("page_exit", {
				scrollDepth: maxScroll,
				sessionTime: Date.now() - startTime,
			});
		});
	}

	// Track visibility change (tab switch)
	document.addEventListener("visibilitychange", () => {
		trackEvent("visibility_change", { visibility: document.visibilityState });
	});

	// Track click events (only buttons, links)
	document.addEventListener("click", (e) => {
		const target = e.target.closest("button, a");
		if (target) {
			trackEvent("click", {
				tag: target.tagName,
				text: target.textContent?.trim().slice(0, 50),
				href: target.href || null,
			});
		}
	});

	const startTime = Date.now();

	// On first load
	window.addEventListener("load", () => {
		trackEvent("page_view", {
			performance: getPerformanceMetrics(),
		});
		trackScrollDepth();
	});
})();
