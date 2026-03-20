/**
 * Pinglet SDK v0.0.3 — Event Tracking System
 * Manages notification lifecycle events (clicked/closed/dropped).
 * Bridge between service worker, main thread, and backend API.
 */

/** @typedef {import('./types/index.js').NotificationEventPayload} NotificationEventPayload */

// ─── Event handler registry ───
window.notificationEventHandlers = window.notificationEventHandlers || {};

/**
 * Dynamically resolve the API endpoint from the script tag.
 * @returns {string}
 */
function _getEndpoint() {
	const script = Array.from(document.scripts).find(
		(s) => s.src.includes("pinglet-sse") && s.dataset.endpoint,
	);
	return script?.dataset.endpoint || "";
}

// ─── Service Worker Bridge ───

if ("serviceWorker" in navigator) {
	navigator.serviceWorker.addEventListener("message", (event) => {
		const { type, eventName, payload } = event.data || {};
		if (type === "CUSTOM_NOTIFICATION_EVENT") {
			triggerNotificationEvent(eventName, payload);
		}
	});
}

// ─── Core Event Functions ───

/**
 * Trigger a custom notification event on the main thread.
 * Dispatches a DOM CustomEvent that other modules can listen to.
 * @param {string} eventName - Event name (e.g., "clicked", "closed", "dropped")
 * @param {NotificationEventPayload} payload - Event payload
 */
function triggerNotificationEvent(eventName, payload) {
	document.dispatchEvent(
		new CustomEvent(`notification:${eventName}`, { detail: payload }),
	);
}

/**
 * Register a handler for a notification event.
 * @param {string} eventName - Event name
 * @param {(payload: NotificationEventPayload) => void} handler - Callback
 */
function onNotificationEvent(eventName, handler) {
	document.addEventListener(`notification:${eventName}`, (event) => {
		handler(event.detail);
	});
}

/**
 * Send a tracking event to the backend.
 * @param {"clicked"|"dropped"|"closed"} event - Event type
 * @param {NotificationEventPayload} data - Event data
 */
async function sendEvent(event, data) {
	if (!data || !("project_id" in data)) return;
	const endpoint = _getEndpoint();
	if (!endpoint) return;

	try {
		await fetch(`${endpoint}/log/track`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ ...data, event }),
			credentials: "omit",
		});
	} catch (err) {
		console.warn("[Pinglet] Event tracking failed:", err);
	}
}

// ─── Register Default Handlers ───

onNotificationEvent("clicked", (payload) => sendEvent("clicked", payload));
onNotificationEvent("dropped", (payload) => sendEvent("dropped", payload));
onNotificationEvent("closed", (payload) => sendEvent("closed", payload));

// ─── Expose to window ───

/** @type {(eventName: string, payload: NotificationEventPayload) => void} */
window.sendNotificationEvent = triggerNotificationEvent;

// ─── Dispatch Helpers (for use by UI modules) ───

/**
 * Fire a custom DOM event (used internally by toast/variant for close events).
 * @param {string} eventName - Full event name (e.g., "pinglet:notificationClosed")
 * @param {Object} detail - Event detail
 * @returns {boolean} Whether default was prevented
 */
export function fireCustomEvent(eventName, detail) {
	return window.dispatchEvent(new CustomEvent(eventName, { detail }));
}

/**
 * Fire a Pinglet tracking event from a notification card element.
 * Reads data-notification-id and data-notification-type from the element.
 * @param {"clicked"|"closed"|"dropped"} type - Event type
 * @param {HTMLElement} card - Notification card element
 * @param {string} [reason="user-dismiss"] - Reason string
 */
export function fireTrackingEvent(type, card, reason) {
	if (typeof window.sendNotificationEvent !== "function") return;
	const notificationId = card.getAttribute("data-notification-id");
	if (!notificationId) return;
	const notificationType = card.getAttribute("data-notification-type") || "0";
	const [projectId, timestamp] = notificationId.split("-");
	window.sendNotificationEvent(type, {
		project_id: projectId,
		notification_id: notificationId,
		timestamp,
		reason: reason || "user-dismiss",
		type: notificationType,
	});
}
