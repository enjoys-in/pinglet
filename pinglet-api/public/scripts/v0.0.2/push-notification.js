import { _showPopup } from "./default.js";
import { subscribeUser } from "./subcription-registeration.js";

/**
 * Create a notification permission dialog to ask users to allow notifications.
 * @param {{title: string, description: string, site: string, onAllow: () => void, onDeny: () => void}} options
 * @returns {HTMLDivElement} The dialog element.
 */
export function createNotificationPermissionDialog(options = {}) {
  const {
    title = "Stay updated with notifications",
    description = "Get notified about important updates, new features, and exclusive content. We'll only send you valuable notifications.",
    site = window.location.hostname,
    onAllow = () => {},
    onDeny = () => {},
  } = options;

  const dialog = document.createElement("div");
  dialog.className = "notification-dialog";
  Object.assign(dialog.style, {
    position: "fixed",
    bottom: "24px",
    right: "24px",
    width: "380px",
    background: "#fff",
    borderRadius: "16px",
    boxShadow:
      "0 20px 40px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255,255,255,0.1)",
    zIndex: "1000",
    overflow: "hidden",
    transform: "translateX(420px)",
    animation: "slideIn 0.6s ease-out 1s forwards",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  });

  // Create animation
  const style = document.createElement("style");
  style.textContent = `
        @keyframes slideIn { to { transform: translateX(0); } }
        @keyframes pulse {
            0%, 100% { box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3); }
            50% { box-shadow: 0 4px 20px rgba(102, 126, 234, 0.5); }
        }
        @media (max-width: 480px) {
            .notification-dialog {
                width: calc(100vw - 32px) !important;
                right: 16px !important;
                bottom: 16px !important;
                transform: translateY(420px) !important;
            }
            @keyframes slideIn { to { transform: translateY(0); } }
        }
    `;
  document.head.appendChild(style);

  // Header
  const header = document.createElement("div");
  header.style.display = "flex";
  header.style.justifyContent = "space-between";
  header.style.padding = "20px 20px 0 20px";

  const siteInfo = document.createElement("div");
  siteInfo.style.display = "flex";
  siteInfo.style.alignItems = "center";
  siteInfo.style.gap = "8px";
  siteInfo.style.color = "#6b7280";
  siteInfo.style.fontSize = "14px";
  siteInfo.style.fontWeight = "500";

  const siteIcon = document.createElement("div");
  siteIcon.style.width = "16px";
  siteIcon.style.height = "16px";
  siteIcon.style.borderRadius = "4px";
  siteIcon.style.background =
    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
  siteIcon.style.display = "flex";
  siteIcon.style.alignItems = "center";
  siteIcon.style.justifyContent = "center";
  siteIcon.innerHTML = `<svg viewBox="0 0 16 16" fill="white" width="10" height="10"><path d="M8 0C3.58 0 0 3.58 0 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8z"/></svg>`;

  const siteName = document.createElement("span");
  siteName.textContent = site;

  siteInfo.append(siteIcon, siteName);

  const closeBtn = document.createElement("button");
  closeBtn.innerHTML = `<svg viewBox="0 0 16 16" fill="currentColor" width="12" height="12">
        <path d="M12.854 4.854a.5.5 0 0 0-.708-.708L8 8.293 3.854 4.146a.5.5 0 1 0-.708.708L7.293 9l-4.147 4.146a.5.5 0 0 0 .708.708L8 9.707l4.146 4.147a.5.5 0 0 0 .708-.708L8.707 9l4.147-4.146z"/>
    </svg>`;
  Object.assign(closeBtn.style, {
    width: "24px",
    height: "24px",
    background: "#f3f4f6",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#6b7280",
  });
  closeBtn.onclick = () => dialog.remove();

  header.append(siteInfo, closeBtn);

  // Content
  const content = document.createElement("div");
  content.style.padding = "16px 24px 24px 24px";

  const icon = document.createElement("div");
  icon.style.width = "48px";
  icon.style.height = "48px";
  icon.style.borderRadius = "12px";
  icon.style.marginBottom = "16px";
  icon.style.animation = "pulse 2s infinite";
  icon.style.background = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
  icon.style.display = "flex";
  icon.style.alignItems = "center";
  icon.style.justifyContent = "center";
  icon.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" width="24" height="24">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>`;

  const titleEl = document.createElement("h3");
  titleEl.textContent = title;
  Object.assign(titleEl.style, {
    fontSize: "18px",
    fontWeight: "600",
    color: "#111827",
    marginBottom: "8px",
  });

  const descEl = document.createElement("p");
  descEl.textContent = description;
  Object.assign(descEl.style, {
    fontSize: "14px",
    color: "#6b7280",
    lineHeight: "1.5",
    marginBottom: "20px",
  });

  // Buttons
  const actions = document.createElement("div");
  actions.style.display = "flex";
  actions.style.gap = "8px";

  const btnNo = document.createElement("button");
  btnNo.textContent = "Not now";
  Object.assign(btnNo.style, {
    flex: 1,
    padding: "10px 16px",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "500",
    border: "1px solid #e5e7eb",
    background: "#f9fafb",
    color: "#6b7280",
    cursor: "pointer",
  });
  btnNo.onclick = () => {
    onDeny();
    dialog.remove();
  };

  const btnYes = document.createElement("button");
  btnYes.textContent = "Allow notifications";
  Object.assign(btnYes.style, {
    flex: 1,
    padding: "10px 16px",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "500",
    border: "none",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "#fff",
    boxShadow: "0 2px 8px rgba(102, 126, 234, 0.3)",
    cursor: "pointer",
  });
  btnYes.onclick = () => {
    onAllow();
    dialog.remove();
  };

  actions.append(btnNo, btnYes);

  // Trust text
  const trust = document.createElement("div");
  trust.style.marginTop = "12px";
  trust.style.display = "flex";
  trust.style.alignItems = "center";
  trust.style.justifyContent = "center";
  trust.style.gap = "6px";
  trust.style.color = "#9ca3af";
  trust.style.fontSize = "12px";
  trust.innerHTML = `<svg viewBox="0 0 16 16" fill="currentColor" width="12" height="12"><path d="M8 0c-.69 0-1.843.265-2.928.56-1.11.3-2.229.655-2.887.87a1.54 1.54 0 0 0-1.044 1.262c-.596 4.477.787 7.795 2.465 9.99a11.777 11.777 0 0 0 2.517 2.453c.386.273.744.482 1.048.625.28.132.581.24.829.24s.548-.108.829-.24a7.159 7.159 0 0 0 1.048-.625 11.775 11.775 0 0 0 2.517-2.453c1.678-2.195 3.061-5.513 2.465-9.99a1.541 1.541 0 0 0-1.044-1.263 62.467 62.467 0 0 0-2.887-.87C9.843.266 8.69 0 8 0z"/></svg><span>Secure & private • Unsubscribe anytime</span>`;

  content.append(icon, titleEl, descEl, actions, trust);
  dialog.append(header, content);
  document.body.appendChild(dialog);
}

export function askNotificationPermissionFunction(endpoint, projectId) {
  if (!("Notification" in window)) {
    _showPopup("Unsupported Browser", "Notifications not supported.", [], "🚫");
    return;
  }
  if (Notification.permission !== "granted") {
    createNotificationPermissionDialog({
      site: window.location.hostname,
      onAllow: () => {
        Notification.requestPermission()
          .then(async (permission) => {
            if (permission === "granted") {
              return subscribeUser(endpoint, projectId);
            } else {
              return _showPopup(
                "Permission Denied",
                "You blocked notifications!",
                [],
                "😭"
              );
            }
          })
          .catch((err) =>
            _showPopup(
              "Permission Error",
              "Error requesting notification permission:",
              [],
              "😭"
            )
          );
      },
      onDeny: () =>
        _showPopup("Permission Denied", "You blocked notifications!", [], "❌"),
    });
    return;
  }
}
function DemoNotification() {
  return new Notification("This is a Demo notification", {
    badge: "🎉",
    body: "This is a demo notification",
    dir: "rtl",
    lang: "en",
    silent: false,
    tag: "pinglet",
    vibrate: [100, 50, 100],
    requireInteraction: true,
  });
}
export function TriggerBrowserNotificationApi(title, body, icon) {
  return (new Notification(title, {
    badge: "🎉",
    body,
    actions: [{ action: "pinglet", title: "Pinglet" }],
    icon,
    dir: "rtl",
    lang: "en",
    silent: false,
    tag: "pinglet",
    vibrate: [100, 50, 100],
    requireInteraction: true,
  }).onclick = () => {
    // window.open("https://pinglet.enjoys.in", "_blank");
  });
}
