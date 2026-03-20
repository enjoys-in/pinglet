/**
 * Pinglet SDK v0.0.3 — Push Subscription Registration
 * Manages browser push notification subscription and unsubscription.
 * Fixed: filename typo (was "subcription-registeration" in v0.0.2).
 */

import { showPopup } from "./popup.js";

/**
 * Revoke (unsubscribe) the current push subscription.
 * @param {string} url - API endpoint
 * @param {string} projectId - Project ID
 */
export async function revokePushSubscription(url, projectId) {
	try {
		const registration = await navigator.serviceWorker.ready;
		const subscription = await registration.pushManager.getSubscription();

		if (!subscription) {
			showPopup("Subscription Error", "No subscription found.", [], "❌");
			return;
		}

		const unsubscribed = await subscription.unsubscribe();
		if (!unsubscribed) {
			showPopup("Subscription Error", "Failed to unsubscribe.", [], "❌");
			return;
		}

		const response = await fetch(`${url}/unsubscribe`, {
			method: "POST",
			body: JSON.stringify({ endpoint: subscription.endpoint, projectId }),
			headers: { "Content-Type": "application/json" },
			credentials: "omit",
		});
		const parsed = await response.json();

		if (parsed.success) {
			localStorage.removeItem("pinglet_subscription");
			showPopup(
				"Notifications Disabled",
				"You can no longer receive BrowserPush Notifications from this site.",
				[],
				"🚫",
			);
		}
	} catch (error) {
		console.error("[Pinglet] Unsubscribe error:", error);
	}
}

/**
 * Subscribe the user to push notifications via the service worker.
 * @param {string} endpoint - API endpoint
 * @param {string} projectId - Project ID
 * @param {string} publicVapidKey - VAPID public key
 */
export async function subscribeUser(endpoint, projectId, publicVapidKey) {
	try {
		const registration = await navigator.serviceWorker.register(
			`${endpoint}/sw.js`,
		);

		const existingSubscription = await registration.pushManager.getSubscription();
		if (existingSubscription) return;

		const subscription = await registration.pushManager.subscribe({
			userVisibleOnly: true,
			applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
		});

		const response = await fetch(
			`${endpoint}/subscribe?projectId=${projectId}`,
			{
				method: "POST",
				body: JSON.stringify(subscription),
				headers: { "Content-Type": "application/json" },
				credentials: "omit",
			},
		);
		const json = await response.json();

		if (json.success) {
			if (!localStorage.getItem("pinglet_subscription")) {
				localStorage.setItem("pinglet_subscription", "true");
				showPopup(
					"Notifications Enabled",
					"You can now receive notifications from this site.",
					[
						{
							text: "See Demo",
							onClick: `()=>{
								new Notification("Pinglet", {
									body: "This is a demo notification",
									icon: "https://pinglet.enjoys.in/favicon.ico"
								}).onclick = () => {
									window.open("https://pinglet.enjoys.in", "_blank");
								}
							}`,
						},
					],
					"🎉",
				);
			}
			return;
		}
		showPopup("Something Went Wrong", json.message, [], "❌");
	} catch (error) {
		console.error("[Pinglet] Subscribe error:", error);
	}
}

/**
 * Convert a URL-safe base64 string to a Uint8Array.
 * Used for VAPID key conversion.
 * @param {string} base64String
 * @returns {Uint8Array}
 */
function urlBase64ToUint8Array(base64String) {
	const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
	const base64 = (base64String + padding)
		.replace(/-/g, "+")
		.replace(/_/g, "/");
	const rawData = window.atob(base64);
	const outputArray = new Uint8Array(rawData.length);
	for (let i = 0; i < rawData.length; i++) {
		outputArray[i] = rawData.charCodeAt(i);
	}
	return outputArray;
}
