/** @typedef {import("./types/native").NotificationPayloadOptions} NotificationPayloadOptions */
// Initialize event handler registry
window.notificationEventHandlers = {};
// Listen for custom events from service worker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.addEventListener("message", (event) => {
    const { type, eventName, payload } = event.data;
    if (type === "CUSTOM_NOTIFICATION_EVENT") {
      triggerCustomNotificationEvent(eventName, payload);
    }
  });
}

/**
 * Trigger custom event on main thread
 * @param {string} eventName - Event name
 * @param {NotificationPayloadOptions} payload - Event payload
 */
function triggerCustomNotificationEvent(eventName, payload) {
  // Method 1: Custom DOM event
  const customEvent = new CustomEvent(`notification:${eventName}`, {
    detail: payload,
  });
  document.dispatchEvent(customEvent);
}

// ===== NOTIFICATION EVENT HANDLER SYSTEM =====

/**
 * Register custom notification event handler
 * @param {string} eventName - Event name
 * @param {(payload:NotificationPayloadOptions)=>void} handler - Event handler function
 */
function onNotificationEvent(eventName, handler) {
  // Also listen for DOM events
  document.addEventListener(`notification:${eventName}`, (event) => {
    handler(event.detail);
  });
}
// Declare and assign to window
/**
 * @typedef {typeof globalThis & {
 *   sendNotificationEvent: ({ eventName: string, payload: NotificationPayloadOptions}) => void;
 * }} CustomWindow
 */
/** @type {CustomWindow} */
window.sendNotificationEvent = triggerCustomNotificationEvent;

onNotificationEvent("clicked", (payload) => sentEvent("clicked", payload));

onNotificationEvent("dropped", (payload) => sentEvent("dropped", payload));

onNotificationEvent("closed", (payload) => sentEvent("closed", payload));
/**
 * Triggered when a notification is sent
 * @param {"clicked"|"dropped"|"closed"} event - Event name
 * @param {NotificationPayloadOptions|import("./types").NotificationData} data - Notification payload
 */
async function sentEvent(event, data) {
  if (!("project_id" in data)) return;
  await fetch(`http://localhost:8888/api/v1/log/event`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...data, event }),
    credentials: "omit",
  });
}
