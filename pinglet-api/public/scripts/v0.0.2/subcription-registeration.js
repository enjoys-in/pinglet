import { _showPopup } from "./default.js";

const publicVapidKey =
  "BJ9GvEJAs47DOgqw-rN80ZGIVvIvcp-xE4ZNweCT4eJ0B-rIzMtfhLWh8ySUCeKgiW_Fym69h0Fx3vhAcAy6C2k";

export async function revokePushSubscription(url, projectId) {
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    if (subscription) {
      const unsubscribed = await subscription.unsubscribe();
      if (unsubscribed) {
        const response = await fetch(url + "/unsubscribe", {
          method: "POST",
          body: JSON.stringify({ endpoint: subscription.endpoint, projectId }),
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "omit",
        });
        const parsed = await response.json();
        if (parsed.success) {
          localStorage.removeItem("subscription");
          _showPopup(
            "Notifications Disabled",
            "You can no longer receive BrowserPush Notifications from this site.",
            [],
            "🚫"
          );
        }
      } else {
        _showPopup("Subscription Error", "Failed to unsubscribe", [], "❌");
      }
    } else {
      _showPopup("Subscription Error", "No subscription found", [], "❌");
    }
  } catch (error) {
    console.log(error);
  }
}

export async function subscribeUser(endpoint, projectId) {
  try {
    const registration = await navigator.serviceWorker.register(
      endpoint + "/sw.js"
    );

    const existingSubscription =
      await registration.pushManager.getSubscription();

    if (existingSubscription) {
      return;
    }

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
      }
    );
    const json = await response.json();
    if (json.success) {
      if (!localStorage.getItem("subscription")) {
        localStorage.setItem("subscription", "true");
        return _showPopup(
          "Notifications Enabled",
          "You can now receive notifications from this site.",
          [
            {
              text: "See Demo",
              onClick: "() => DemoNotification()",
            },
          ],
          "🎉"
        );
      }
      return;
    }
    _showPopup("Something Went Wrong", json.message, [], "❌");
  } catch (error) {}
}

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}
