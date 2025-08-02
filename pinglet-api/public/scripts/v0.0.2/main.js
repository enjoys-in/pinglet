// Listen for custom events from service worker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.addEventListener("message", (event) => {
    const { type, eventName, payload } = event.data;

    if (type === "CUSTOM_NOTIFICATION_EVENT") {
      // Trigger custom event on main thread
      triggerCustomNotificationEvent(eventName, payload);
    }
  });
}

/**
 * Trigger custom event on main thread
 * @param {string} eventName - Event name
 * @param {Object} payload - Event payload
 */
function triggerCustomNotificationEvent(eventName, payload) {
  // Method 1: Custom DOM event
  const customEvent = new CustomEvent(`notification:${eventName}`, {
    detail: payload,
  });
  document.dispatchEvent(customEvent);

  // Method 2: Call registered handlers
  if (
    window.notificationEventHandlers &&
    window.notificationEventHandlers[eventName]
  ) {
    window.notificationEventHandlers[eventName](payload);
  }
}

// ===== NOTIFICATION EVENT HANDLER SYSTEM =====

// Initialize event handler registry
window.notificationEventHandlers = {};

/**
 * Register custom notification event handler
 * @param {string} eventName - Event name
 * @param {Function} handler - Event handler function
 */
function onNotificationEvent(eventName, handler) {
  window.notificationEventHandlers[eventName] = handler;

  // Also listen for DOM events
  document.addEventListener(`notification:${eventName}`, (event) => {
    handler(event.detail);
  });
}

onNotificationEvent("order_approved", (payload) => {
  console.log("Order approved:", payload);
  // Update UI, show success message, etc.
  updateOrderStatus(payload.orderId, "approved");
});

onNotificationEvent("message_reply", (payload) => {
  // Open chat interface, pre-fill reply, etc.
  openChatWindow(payload.conversationId, payload.replyText);
});

onNotificationEvent("task_completed", (payload) => {
  console.log("Task completed:", payload);
  // Update task list, show completion animation, etc.
  markTaskComplete(payload.taskId);
});

function updateOrderStatus(orderId, status) {
  // Update order in UI
  const orderElement = document.querySelector(`[data-order-id="${orderId}"]`);
  if (orderElement) {
    orderElement.classList.add(`status-${status}`);
  }
}

function openChatWindow(conversationId, prefilledText) {
  window.open(
    `/chat/${conversationId}?reply=${encodeURIComponent(prefilledText)}`
  );
}

function markTaskComplete(taskId) {
  // Mark task as complete
  const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
  if (taskElement) {
    taskElement.classList.add("completed");
  }
}
