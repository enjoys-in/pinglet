/**
 * Pinglet SDK v0.0.3 — Service Worker
 * Handles push notifications, notification click/close events,
 * broadcasts events to main thread, and tracks events to backend.
 */

let isTabOpen = false;
const API_BASE = self.location.href.substring(0, self.location.href.lastIndexOf("/"));

// ─── Lifecycle ───

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", () => self.clients.claim());

// ─── Push Handler ───

self.addEventListener("push", async (event) => {
	if (!event.data) return;

	const data = event.data?.json?.() || {};
	const options = {
		body: data?.body,
		icon: data?.icon,
		badge: data?.badge,
		tag: data?.tag,
		requireInteraction: data?.requireInteraction ?? true,
		silent: data?.silent ?? false,
		data: data?.data,
		actions: data?.actions,
		image: data?.image,
		timestamp: Date.now(),
		vibrate: [200, 100, 200],
	};

	// Auto-dismiss after duration
	if (data.data?.duration) {
		setTimeout(async () => {
			try {
				const notifications = await self.registration.getNotifications({ tag: data.tag });
				const clientsList = await self.clients.matchAll({ type: "window", includeUncontrolled: true });

				for (const notification of notifications) {
					const payload = {
						...data?.data,
						notificationTag: notification.tag,
						timestamp: Date.now(),
					};

					if (clientsList.length > 0) {
						broadcastEvent("dropped", payload);
					} else {
						fireEvent("dropped", payload);
					}
					notification.close();
				}
			} catch (_) {}
		}, data.data?.duration || 5000);
	}

	const clientsList = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
	isTabOpen = clientsList.length > 0;

	event.waitUntil(self.registration.showNotification(data.title, options));
});

// ─── Notification Click ───

self.addEventListener("notificationclick", (event) => {
	event.notification.close();
	const notificationData = event.notification.data || {};
	const actionId = event.action;

	if (actionId && notificationData.actionEvents?.[actionId]) {
		const actionConfig = notificationData.actionEvents[actionId];
		event.waitUntil(handleAction(actionConfig, notificationData, event));
	} else if (actionId === "dismiss") {
		const payload = {
			...notificationData,
			notificationTag: event.notification.tag,
			timestamp: Date.now(),
		};
		if (isTabOpen) {
			event.waitUntil(broadcastEvent("closed", payload));
		} else {
			event.waitUntil(fireEvent("closed", payload));
		}
	} else {
		// Default: treat as "clicked"
		const payload = {
			...notificationData,
			notificationTag: event.notification.tag,
			timestamp: Date.now(),
		};
		if (isTabOpen) {
			event.waitUntil(broadcastEvent("clicked", payload));
		} else {
			event.waitUntil(fireEvent("clicked", payload));
		}

		// Open URL if available
		if (notificationData.url) {
			event.waitUntil(self.clients.openWindow(notificationData.url));
		}
	}
});

// ─── Notification Close (user swipes away) ───

self.addEventListener("notificationclose", (event) => {
	const notificationData = event.notification.data || {};
	const payload = {
		...notificationData,
		notificationTag: event.notification.tag,
		timestamp: Date.now(),
	};

	if (isTabOpen) {
		event.waitUntil(broadcastEvent("closed", payload));
	} else {
		event.waitUntil(fireEvent("closed", payload));
	}
});

// ─── Action Handler ───

async function handleAction(actionConfig, notificationData, event) {
	const { eventName, eventData, url, windowAction } = actionConfig;

	try {
		const payload = {
			...eventData,
			notificationTag: event.notification.tag,
			timestamp: Date.now(),
		};

		if (isTabOpen) {
			await broadcastEvent(eventName, payload);
		} else {
			await fireEvent("clicked", {
				...notificationData,
				notificationTag: event.notification.tag,
				timestamp: Date.now(),
			});
		}

		if (windowAction === "open" && url) {
			await self.clients.openWindow(url);
		} else if (windowAction === "focus") {
			const windowClients = await self.clients.matchAll({ type: "window" });
			if (windowClients.length > 0) {
				await windowClients[0].focus();
			} else if (url) {
				await self.clients.openWindow(url);
			}
		}
	} catch (error) {
		console.error("[Pinglet SW] Action handler error:", error);
	}
}

// ─── Communication ───

/**
 * Broadcast event to all open tabs.
 */
async function broadcastEvent(eventName, payload) {
	const allClients = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
	for (const client of allClients) {
		client.postMessage({
			type: "CUSTOM_NOTIFICATION_EVENT",
			eventName,
			payload,
		});
	}
}

/**
 * Fire event directly to backend (when no tabs are open).
 */
async function fireEvent(event, data) {
	if (!data || !("project_id" in data)) return;
	try {
		await fetch(`${API_BASE}/log/event`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ ...data, event }),
		});
	} catch (_) {}
}
