import { _showPopup } from "./default.js";
import { subscribeUser } from "./subcription-registeration.js";

const PERM_STYLE_ID = "__pinglet_v2_perm_css__";
const PERM_FONT_ID = "__pinglet_v2_perm_font__";

function _injectPermStyles() {
	if (document.getElementById(PERM_STYLE_ID)) return;

	if (!document.getElementById(PERM_FONT_ID)) {
		const link = document.createElement("link");
		link.id = PERM_FONT_ID;
		link.rel = "stylesheet";
		link.href = "https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&display=swap";
		document.head.appendChild(link);
	}

	const s = document.createElement("style");
	s.id = PERM_STYLE_ID;
	s.textContent = `
.pgl-v2-perm{position:fixed;bottom:24px;right:24px;width:380px;z-index:2147483646;border-radius:16px;overflow:hidden;
  background:rgba(255,255,255,0.82);backdrop-filter:blur(28px) saturate(1.5);-webkit-backdrop-filter:blur(28px) saturate(1.5);
  border:1px solid rgba(255,255,255,0.6);box-shadow:0 20px 60px rgba(0,0,0,0.10),0 2px 12px rgba(0,0,0,0.05);
  font-family:'Manrope',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#1c1c2e;
  opacity:0;transform:translateX(420px);animation:pgl-v2-in .6s cubic-bezier(.22,1,.36,1) 1s forwards}
.pgl-v2-perm.pgl-v2-dk{background:rgba(18,18,32,0.88);border:1px solid rgba(255,255,255,0.08);
  box-shadow:0 20px 60px rgba(0,0,0,0.4),0 2px 12px rgba(0,0,0,0.2);color:#e8e8f0}
@keyframes pgl-v2-in{to{opacity:1;transform:translateX(0)}}
@keyframes pgl-v2-out{to{opacity:0;transform:translateX(420px)}}
@keyframes pgl-v2-pulse{0%,100%{box-shadow:0 0 16px rgba(102,126,234,0.25)}50%{box-shadow:0 0 28px rgba(102,126,234,0.45)}}
.pgl-v2-accent{height:3px;background:linear-gradient(90deg,#667eea,#764ba2,#ec4899)}
.pgl-v2-inner{padding:20px 24px 20px}
.pgl-v2-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px}
.pgl-v2-site{display:flex;align-items:center;gap:8px;font-size:13px;font-weight:500;color:#6b7280}
.pgl-v2-dk .pgl-v2-site{color:#8b8ba0}
.pgl-v2-dot{width:7px;height:7px;border-radius:50%;background:#22c55e;flex-shrink:0}
.pgl-v2-x{width:28px;height:28px;border:none;border-radius:8px;cursor:pointer;display:flex;align-items:center;justify-content:center;
  background:rgba(0,0,0,0.04);color:#a1a1aa;transition:all .2s}
.pgl-v2-x:hover{background:rgba(0,0,0,0.08);color:#52525b}
.pgl-v2-dk .pgl-v2-x{background:rgba(255,255,255,0.06);color:#6b6b80}
.pgl-v2-dk .pgl-v2-x:hover{background:rgba(255,255,255,0.12);color:#a5a5bf}
.pgl-v2-x svg{width:13px;height:13px}
.pgl-v2-bell{width:48px;height:48px;border-radius:12px;margin-bottom:16px;display:flex;align-items:center;justify-content:center;
  background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);animation:pgl-v2-pulse 2s infinite}
.pgl-v2-title{font-size:18px;font-weight:700;margin:0 0 8px;letter-spacing:-0.2px;line-height:1.35}
.pgl-v2-desc{font-size:13.5px;color:#6b7280;line-height:1.55;margin:0 0 20px;font-weight:400}
.pgl-v2-dk .pgl-v2-desc{color:#8b8ba0}
.pgl-v2-btns{display:flex;gap:8px}
.pgl-v2-btn{flex:1;padding:10px 16px;border-radius:10px;font-family:'Manrope',sans-serif;font-size:14px;font-weight:600;
  cursor:pointer;transition:all .2s;border:none;letter-spacing:0.1px}
.pgl-v2-deny{background:rgba(0,0,0,0.04);color:#6b7280;border:1px solid rgba(0,0,0,0.06)}
.pgl-v2-deny:hover{background:rgba(0,0,0,0.08)}
.pgl-v2-dk .pgl-v2-deny{background:rgba(255,255,255,0.06);color:#8b8ba0;border-color:rgba(255,255,255,0.08)}
.pgl-v2-dk .pgl-v2-deny:hover{background:rgba(255,255,255,0.10)}
.pgl-v2-allow{background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;
  box-shadow:0 4px 14px rgba(102,126,234,0.3)}
.pgl-v2-allow:hover{box-shadow:0 6px 20px rgba(102,126,234,0.4);transform:translateY(-1px)}
.pgl-v2-dk .pgl-v2-allow{box-shadow:0 4px 14px rgba(102,126,234,0.2)}
.pgl-v2-trust{display:flex;align-items:center;justify-content:center;gap:5px;margin-top:12px;
  font-size:11px;color:#9ca3af;font-weight:400}
.pgl-v2-dk .pgl-v2-trust{color:#5c5c72}
.pgl-v2-trust svg{width:11px;height:11px;opacity:0.7}
@media(max-width:480px){.pgl-v2-perm{width:calc(100vw - 32px);right:16px;bottom:16px}}
`;
	document.head.appendChild(s);
}

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

	_injectPermStyles();

	const dark = window.matchMedia("(prefers-color-scheme: dark)").matches;

	const dialog = document.createElement("div");
	dialog.className = "pgl-v2-perm" + (dark ? " pgl-v2-dk" : "");

	// Accent bar
	const accent = document.createElement("div");
	accent.className = "pgl-v2-accent";
	dialog.appendChild(accent);

	// Inner
	const inner = document.createElement("div");
	inner.className = "pgl-v2-inner";

	// Top: site + close
	const topRow = document.createElement("div");
	topRow.className = "pgl-v2-top";

	const siteEl = document.createElement("div");
	siteEl.className = "pgl-v2-site";
	siteEl.innerHTML = '<span class="pgl-v2-dot"></span><span>' + site + '</span>';

	const closeBtn = document.createElement("button");
	closeBtn.className = "pgl-v2-x";
	closeBtn.setAttribute("aria-label", "Close");
	closeBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></svg>';
	closeBtn.onclick = () => {
		dialog.style.animation = "pgl-v2-out .3s ease forwards";
		dialog.addEventListener("animationend", () => dialog.remove(), { once: true });
	};
	topRow.append(siteEl, closeBtn);
	inner.appendChild(topRow);

	// Bell icon
	const bell = document.createElement("div");
	bell.className = "pgl-v2-bell";
	bell.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" width="24" height="24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>';
	inner.appendChild(bell);

	// Title
	const titleEl = document.createElement("div");
	titleEl.className = "pgl-v2-title";
	titleEl.textContent = title;
	inner.appendChild(titleEl);

	// Description
	const descEl = document.createElement("div");
	descEl.className = "pgl-v2-desc";
	descEl.textContent = description;
	inner.appendChild(descEl);

	// Buttons
	const btns = document.createElement("div");
	btns.className = "pgl-v2-btns";

	const btnNo = document.createElement("button");
	btnNo.className = "pgl-v2-btn pgl-v2-deny";
	btnNo.textContent = "Not now";
	btnNo.onclick = () => {
		onDeny();
		dialog.style.animation = "pgl-v2-out .3s ease forwards";
		dialog.addEventListener("animationend", () => dialog.remove(), { once: true });
	};

	const btnYes = document.createElement("button");
	btnYes.className = "pgl-v2-btn pgl-v2-allow";
	btnYes.textContent = "Allow notifications";
	btnYes.onclick = () => {
		onAllow();
		dialog.style.animation = "pgl-v2-out .3s ease forwards";
		dialog.addEventListener("animationend", () => dialog.remove(), { once: true });
	};

	btns.append(btnNo, btnYes);
	inner.appendChild(btns);

	// Trust footer
	const trust = document.createElement("div");
	trust.className = "pgl-v2-trust";
	trust.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg><span>Secure & private \u2022 Unsubscribe anytime</span>';
	inner.appendChild(trust);

	dialog.appendChild(inner);
	document.body.appendChild(dialog);
}

export function askNotificationPermissionFunction(
	endpoint,
	projectId,
	pingletId,
) {
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
							return subscribeUser(endpoint, projectId, pingletId);
						}
						return _showPopup(
							"Permission Denied",
							"You blocked notifications!",
							[],
							"😭",
						);
					})
					.catch((err) =>
						_showPopup(
							"Permission Error",
							"Error requesting notification permission:",
							[],
							"😭",
						),
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
