self.addEventListener("push", (event) => {
  const data = event.data.json();

  const options = {
    body: data.body,
    icon: data.icon,
    badge: data.badge,
    actions: [{ action: "custom", title: "Open Pinglet" }],
    requireInteraction: true,
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener("notificationclick", (event) => {
  if (event.action === "redirect") {
  }
  if (event.action === "alert") {
  }
  if (event.action === "custom") {
  }
  event.notification.close();
  event.waitUntil(clients.openWindow("https://pinglet.enjoys.in"));
});
