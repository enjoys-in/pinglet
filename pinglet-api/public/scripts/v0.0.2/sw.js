self.addEventListener("push", (event) => {
  console.log("first")
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
    vibrate: [200, 100, 200], // Vibration pattern for mobile devices
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
  const actionId = event.action; // The action button that was clicked

  if (event.action === "view") {
    // Open the app/website
    event.waitUntil(clients.openWindow(event.notification.data.url || "/"));
  } else if (event.action === "dismiss") {
    return;
  } else {
  }
});

// Handle notification close
self.addEventListener("notificationclose", (event) => {
  console.log("Notification closed:", event.notification.tag);
});
