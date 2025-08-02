self.addEventListener("push", (event) => {
  if (!event.data) return;

  const data = event.data.json();

  const options = {
    body: data?.body,
    icon: data?.icon,
    badge: data?.badge,
    tag: data?.tag,
    requireInteraction: data?.requireInteraction || true,
    silent: data?.silent || false,
    data: data?.data, // This will contain custom event mappings and payloads
    actions: data?.actions, // Custom actions with user-defined names
    image: data?.image,
    timestamp: Date.now(),
    vibrate: [200, 100, 200],
  };

  // Auto-dismiss after duration
  if (data.data && data.data.duration) {
    setTimeout(() => {
      self.registration
        .getNotifications({ tag: data.tag })
        .then((notifications) => {
          notifications.forEach((notification) => notification.close());
        });
    }, data.data.duration);
  }

  event.waitUntil(self.registration.showNotification(data.title, options));
});

// Enhanced notification click handler for custom actions
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const notificationData = event.notification.data || {};
  const actionId = event.action; // The action button that was clicked
  
  // Handle custom actions with event mapping
  if (actionId && notificationData.actionEvents && notificationData.actionEvents[actionId]) {
    const actionConfig = notificationData.actionEvents[actionId];
    
    // Trigger custom event with payload
    event.waitUntil(
      handleCustomAction(actionConfig, notificationData, event)
    );
  } else if (actionId === "dismiss") {
    // Built-in dismiss action
    return;
  } else {
    // Default click action (no specific action button clicked)
    const defaultUrl = notificationData.url || "/";
    event.waitUntil(clients.openWindow(defaultUrl));
  }
});

/**
 * Handle custom action with event triggering
 * @param {Object} actionConfig - Action configuration
 * @param {Object} notificationData - Full notification data
 * @param {NotificationEvent} event - Original notification event
 */
async function handleCustomAction(actionConfig, notificationData, event) {
  const { eventName, eventData, url, windowAction } = actionConfig;
  
  try {
    // 1. Trigger custom event to main thread
    await broadcastCustomEvent(eventName, {
      ...eventData,
      notificationTag: event.notification.tag,
      timestamp: Date.now()
    });

    // 2. Handle window/URL actions
    if (windowAction === "open" && url) {
      await clients.openWindow(url);
    } else if (windowAction === "focus") {
      const windowClients = await clients.matchAll({ type: 'window' });
      if (windowClients.length > 0) {
        await windowClients[0].focus();
      } else if (url) {
        await clients.openWindow(url);
      }
    }

    // 3. Log action for analytics
    console.log(`Custom action triggered: ${eventName}`, eventData);
    
  } catch (error) {
    console.error('Error handling custom action:', error);
  }
}

/**
 * Broadcast custom event to all clients
 * @param {string} eventName - Custom event name
 * @param {Object} payload - Event payload data
 */
async function broadcastCustomEvent(eventName, payload) {
  const clients = await self.clients.matchAll({ includeUncontrolled: true });
  
  clients.forEach(client => {
    client.postMessage({
      type: 'CUSTOM_NOTIFICATION_EVENT',
      eventName: eventName,
      payload: payload
    });
  });
}

// Handle notification close with custom events
self.addEventListener("notificationclose", (event) => {
  console.log("Notification closed:", event.notification.tag);
  
  const notificationData = event.notification.data || {};
  
  // Trigger close event if configured
  if (notificationData.closeEvent) {
    broadcastCustomEvent(notificationData.closeEvent.eventName, {
      ...notificationData.closeEvent.eventData,
      notificationTag: event.notification.tag,
      action: 'close'
    });
  }
});

// ===== MAIN THREAD (main.js) =====

// Listen for custom events from service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('message', (event) => {
    const { type, eventName, payload } = event.data;
    
    if (type === 'CUSTOM_NOTIFICATION_EVENT') {
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
    detail: payload
  });
  document.dispatchEvent(customEvent);
  
  // Method 2: Call registered handlers
  if (window.notificationEventHandlers && window.notificationEventHandlers[eventName]) {
    window.notificationEventHandlers[eventName](payload);
  }
  
  console.log(`Custom notification event triggered: ${eventName}`, payload);
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

// ===== EXAMPLE USAGE =====

// Example 1: Register custom event handlers
onNotificationEvent('order_approved', (payload) => {
  console.log('Order approved:', payload);
  // Update UI, show success message, etc.
  updateOrderStatus(payload.orderId, 'approved');
});

onNotificationEvent('message_reply', (payload) => {
  console.log('Reply to message:', payload);
  // Open chat interface, pre-fill reply, etc.
  openChatWindow(payload.conversationId, payload.replyText);
});

onNotificationEvent('task_completed', (payload) => {
  console.log('Task completed:', payload);
  // Update task list, show completion animation, etc.
  markTaskComplete(payload.taskId);
});

// Example 2: Send notification with custom actions
async function sendNotificationWithCustomActions() {
  const notificationPayload = {
    title: "New Order #12345",
    body: "Customer John Doe placed a new order",
    icon: "/order-icon.png",
    badge: "/order-badge.png",
    tag: "order-12345",
    actions: [
      {
        action: "approve_order", // Custom action ID
        title: "Approve",
        icon: "/approve-icon.png"
      },
      {
        action: "view_details", // Custom action ID
        title: "View Details",
        icon: "/view-icon.png"
      },
      {
        action: "dismiss",
        title: "Dismiss"
      }
    ],
    data: {
      url: "/orders/12345",
      duration: 10000,
      // Custom action event mappings
      actionEvents: {
        approve_order: {
          eventName: "order_approved",
          eventData: {
            orderId: "12345",
            customerId: "customer-456",
            amount: 99.99
          },
          url: "/orders/12345/approve",
          windowAction: "open"
        },
        view_details: {
          eventName: "order_viewed",
          eventData: {
            orderId: "12345",
            source: "notification"
          },
          url: "/orders/12345",
          windowAction: "focus"
        }
      },
      // Close event configuration
      closeEvent: {
        eventName: "notification_dismissed",
        eventData: {
          notificationType: "order",
          orderId: "12345"
        }
      }
    }
  };

  // Send to server
  await fetch('/send-notification', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(notificationPayload)
  });
}

// Example 3: Message notification with reply action
async function sendMessageNotification() {
  const notificationPayload = {
    title: "New Message from Sarah",
    body: "Hey! Are we still meeting for lunch?",
    icon: "/message-icon.png",
    actions: [
      {
        action: "quick_reply",
        title: "Quick Reply",
        icon: "/reply-icon.png"
      },
      {
        action: "mark_read",
        title: "Mark Read"
      }
    ],
    data: {
      actionEvents: {
        quick_reply: {
          eventName: "message_reply",
          eventData: {
            conversationId: "conv-789",
            senderId: "user-sarah",
            replyText: "Yes, see you at 12!"
          },
          url: "/chat/conv-789",
          windowAction: "open"
        },
        mark_read: {
          eventName: "message_read",
          eventData: {
            messageId: "msg-123",
            conversationId: "conv-789"
          },
          windowAction: "none"
        }
      }
    }
  };

  await fetch('/send-notification', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(notificationPayload)
  });
}

// ===== UTILITY FUNCTIONS =====

// Example application functions that handle custom events
function updateOrderStatus(orderId, status) {
  // Update order in UI
  const orderElement = document.querySelector(`[data-order-id="${orderId}"]`);
  if (orderElement) {
    orderElement.classList.add(`status-${status}`);
  }
}


function openChatWindow(conversationId, prefilledText) {
  // Open chat interface
  window.open(`/chat/${conversationId}?reply=${encodeURIComponent(prefilledText)}`);
}

function markTaskComplete(taskId) {
  // Mark task as complete
  const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
  if (taskElement) {
    taskElement.classList.add('completed');
  }
}

// Export functions for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    onNotificationEvent,
    sendNotificationWithCustomActions,
    sendMessageNotification
  };
}