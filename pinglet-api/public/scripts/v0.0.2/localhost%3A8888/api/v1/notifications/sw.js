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
    data: data?.data,
    actions: data?.actions,
    image: data?.image,
    timestamp: Date.now(),
    vibrate: [200, 100, 200], // Vibration pattern for mobile
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

// Handle notification clicks
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const notificationData = event.notification.data || {};
  const actionId = event.action;
  if (
    actionId &&
    notificationData.actionEvents &&
    notificationData.actionEvents[actionId]
  ) {
    const actionConfig = notificationData.actionEvents[actionId];
    async function handleCustomAction(actionConfig, notificationData, event) {
      const { eventName, eventData, url, windowAction } = actionConfig;

      try {
        async function broadcastCustomEvent(eventName, payload) {
          const clients = await self.clients.matchAll({
            includeUncontrolled: true,
          });

          clients.forEach((client) => {
            client.postMessage({
              type: "CUSTOM_NOTIFICATION_EVENT",
              eventName: eventName,
              payload: payload,
            });
          });
        }
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
    event.waitUntil(handleCustomAction(actionConfig, notificationData, event));
  } else if (event.action === "dismiss") {
    // Built-in dismiss action
    console.log("first");

    return;
  } else {
    const defaultUrl = notificationData.url || "/";
    event.waitUntil(clients.openWindow(defaultUrl));
  }
});

// Handle notification close
self.addEventListener("notificationclose", (event) => {
  console.log("Notification closed:", event.notification.tag);
});
