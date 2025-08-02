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
  if (
    actionId &&
    notificationData.actionEvents &&
    notificationData.actionEvents[actionId]
  ) {
    const actionConfig = notificationData.actionEvents[actionId];

    // Trigger custom event with payload
    event.waitUntil(handleCustomAction(actionConfig, notificationData, event));
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
      timestamp: Date.now(),
    });

    // 2. Handle window/URL actions
    if (windowAction === "open" && url) {
      await clients.openWindow(url);
    } else if (windowAction === "focus") {
      const windowClients = await clients.matchAll({ type: "window" });
      if (windowClients.length > 0) {
        await windowClients[0].focus();
      } else if (url) {
        await clients.openWindow(url);
      }
    }

    // 3. Log action for analytics
    console.log(`Custom action triggered: ${eventName}`, eventData);
  } catch (error) {
    console.error("Error handling custom action:", error);
  }
}

/**
 * Broadcast custom event to all clients
 * @param {string} eventName - Custom event name
 * @param {Object} payload - Event payload data
 */
async function broadcastCustomEvent(eventName, payload) {
  const clients = await self.clients.matchAll({ includeUncontrolled: true });

  clients.forEach((client) => {
    client.postMessage({
      type: "CUSTOM_NOTIFICATION_EVENT",
      eventName: eventName,
      payload: payload,
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
      action: "close",
    });
  }
});
