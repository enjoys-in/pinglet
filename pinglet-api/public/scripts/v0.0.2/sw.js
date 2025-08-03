self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  clients.claim();
});
self.addEventListener("push", (event) => {
  console.log("[Service Worker] Push Received.");
  if (!event.data) return;

  const data = event.data?.json?.() || {};
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
          notifications.forEach((notification) => {
            broadcastCustomEvent("dropped", {
              ...data,
              notificationTag: notification.tag,
              timestamp: Date.now(),
            });
            notification.close();
          });
        });
    }, data.data?.duration||5000);
  }

  event.waitUntil(self.registration.showNotification(data.title, options));
});
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
      } catch (error) {}
    }
    event.waitUntil(handleCustomAction(actionConfig, notificationData, event));
  } else if (event.action === "dismiss") {
    event.waitUntil(
      broadcastCustomEvent("closed", {
        ...notificationData,
        notificationTag: event.notification.tag,
        timestamp: Date.now(),
      })
    );
    return event.notification.close();
  } else {
    if ("url" in notificationData) {
      const url = notificationData.url;
      event.waitUntil(clients.openWindow(url));
    }
    event.waitUntil(
      broadcastCustomEvent("clicked", {
        ...notificationData,
        notificationTag: event.notification.tag,
        timestamp: Date.now(),
      })
    );
  }
});

// Handle notification close
self.addEventListener("notificationclose", (event) => {
  console.log("Notification closed:", event.notification.tag);
});
