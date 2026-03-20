/**
 * Pinglet SDK v0.0.3 — Push Permission Dialog
 * Modern frosted-glass permission dialog with Manrope font.
 * Supports dark/light mode via system preference.
 */

import { showPopup } from "./popup.js";
import { subscribeUser } from "./subscription-registration.js";

const PERM_STYLE_ID = "__pinglet_perm_css__";
const PERM_FONT_ID = "__pinglet_perm_font__";

function _injectPermStyles() {
	if (document.getElementById(PERM_STYLE_ID)) return;

	// Fonts
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
/* Permission dialog */
.pgl-perm{position:fixed;bottom:24px;right:24px;width:370px;z-index:2147483646;border-radius:20px;overflow:hidden;
  background:rgba(255,255,255,0.82);backdrop-filter:blur(28px) saturate(1.5);-webkit-backdrop-filter:blur(28px) saturate(1.5);
  border:1px solid rgba(255,255,255,0.6);box-shadow:0 20px 60px rgba(0,0,0,0.10),0 2px 12px rgba(0,0,0,0.05);
  font-family:'Manrope',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#1c1c2e;
  opacity:0;transform:translateY(30px) scale(0.97);animation:pgl-perm-in .5s cubic-bezier(.22,1,.36,1) .8s forwards}
/* Dark */
.pgl-perm.pgl-dk{background:rgba(18,18,32,0.88);border:1px solid rgba(255,255,255,0.08);
  box-shadow:0 20px 60px rgba(0,0,0,0.4),0 2px 12px rgba(0,0,0,0.2);color:#e8e8f0}
/* Anim */
@keyframes pgl-perm-in{to{opacity:1;transform:translateY(0) scale(1)}}
@keyframes pgl-perm-out{to{opacity:0;transform:translateY(20px) scale(0.95)}}
@keyframes pgl-bell-ring{0%,100%{transform:rotate(0)}15%{transform:rotate(14deg)}30%{transform:rotate(-12deg)}45%{transform:rotate(8deg)}60%{transform:rotate(-4deg)}75%{transform:rotate(2deg)}}
@keyframes pgl-glow{0%,100%{box-shadow:0 0 16px rgba(99,102,241,0.25)}50%{box-shadow:0 0 28px rgba(99,102,241,0.45)}}
/* Top accent bar */
.pgl-perm-accent{height:3px;background:linear-gradient(90deg,#6366f1,#a855f7,#ec4899);border-radius:20px 20px 0 0}
/* Inner */
.pgl-perm-inner{padding:22px 24px 20px}
/* Top row */
.pgl-perm-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:18px}
.pgl-perm-site{display:flex;align-items:center;gap:8px;font-size:12.5px;font-weight:400;color:#71717a;letter-spacing:0.3px}
.pgl-dk .pgl-perm-site{color:#8b8ba0}
.pgl-perm-dot{width:7px;height:7px;border-radius:50%;background:#22c55e;flex-shrink:0}
.pgl-perm-x{width:28px;height:28px;border:none;border-radius:10px;cursor:pointer;display:flex;align-items:center;justify-content:center;
  background:rgba(0,0,0,0.04);color:#a1a1aa;transition:all .2s}
.pgl-perm-x:hover{background:rgba(0,0,0,0.08);color:#52525b}
.pgl-dk .pgl-perm-x{background:rgba(255,255,255,0.06);color:#6b6b80}
.pgl-dk .pgl-perm-x:hover{background:rgba(255,255,255,0.12);color:#a5a5bf}
.pgl-perm-x svg{width:13px;height:13px}
/* Bell icon */
.pgl-perm-bell{width:56px;height:56px;border-radius:16px;margin:0 auto 16px;display:flex;align-items:center;justify-content:center;
  background:linear-gradient(135deg,#6366f1 0%,#8b5cf6 50%,#a855f7 100%);animation:pgl-glow 3s ease-in-out infinite;position:relative}
.pgl-perm-bell svg{animation:pgl-bell-ring 2s ease-in-out 1.5s}
.pgl-perm-bell::after{content:'';position:absolute;top:-2px;right:-2px;width:14px;height:14px;border-radius:50%;
  background:#22c55e;border:2.5px solid rgba(255,255,255,0.9)}
.pgl-dk .pgl-perm-bell::after{border-color:rgba(18,18,32,0.9)}
/* Text */
.pgl-perm-title{font-family:'Manrope',sans-serif;font-size:17px;font-weight:700;text-align:center;margin:0 0 8px;letter-spacing:-0.2px;line-height:1.35}
.pgl-perm-desc{font-family:'Manrope',sans-serif;font-size:13.5px;color:#6b7280;text-align:center;line-height:1.55;margin:0 0 22px;font-weight:400}
.pgl-dk .pgl-perm-desc{color:#8b8ba0}
/* Features */
.pgl-perm-feats{display:flex;gap:6px;margin-bottom:20px;justify-content:center;flex-wrap:wrap}
.pgl-perm-feat{display:flex;align-items:center;gap:5px;font-size:11.5px;font-weight:400;color:#6b7280;
  background:rgba(99,102,241,0.06);padding:4px 10px;border-radius:20px}
.pgl-dk .pgl-perm-feat{background:rgba(99,102,241,0.12);color:#a5a5c0}
.pgl-perm-feat svg{width:12px;height:12px;color:#6366f1;flex-shrink:0}
.pgl-dk .pgl-perm-feat svg{color:#818cf8}
/* Buttons */
.pgl-perm-btns{display:flex;gap:10px}
.pgl-perm-btn{flex:1;padding:11px 16px;border-radius:12px;font-family:'Manrope',sans-serif;font-size:13.5px;font-weight:600;
  cursor:pointer;transition:all .2s;border:none;letter-spacing:0.2px}
.pgl-perm-deny{background:rgba(0,0,0,0.04);color:#71717a}
.pgl-perm-deny:hover{background:rgba(0,0,0,0.08)}
.pgl-dk .pgl-perm-deny{background:rgba(255,255,255,0.06);color:#8b8ba0}
.pgl-dk .pgl-perm-deny:hover{background:rgba(255,255,255,0.10)}
.pgl-perm-allow{background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;
  box-shadow:0 4px 14px rgba(99,102,241,0.3)}
.pgl-perm-allow:hover{box-shadow:0 6px 20px rgba(99,102,241,0.4);transform:translateY(-1px)}
.pgl-dk .pgl-perm-allow{box-shadow:0 4px 14px rgba(99,102,241,0.2)}
/* Trust */
.pgl-perm-trust{display:flex;align-items:center;justify-content:center;gap:5px;margin-top:14px;
  font-size:11px;color:#a1a1aa;font-weight:400}
.pgl-dk .pgl-perm-trust{color:#5c5c72}
.pgl-perm-trust svg{width:11px;height:11px;opacity:0.7}
/* Mobile */
@media(max-width:440px){.pgl-perm{width:calc(100vw - 24px);right:12px;bottom:12px}}
`;
	document.head.appendChild(s);
}

/**
 * Create and show a notification permission dialog.
 * @param {Object} [options]
 * @param {string} [options.title]
 * @param {string} [options.description]
 * @param {string} [options.site]
 * @param {() => void} [options.onAllow]
 * @param {() => void} [options.onDeny]
 * @returns {HTMLDivElement}
 */
export function createNotificationPermissionDialog(options = {}) {
	const {
		title = "Stay in the loop",
		description = "Get instant updates on new features, important alerts, and exclusive content — right on your screen.",
		site = window.location.hostname,
		onAllow = () => {},
		onDeny = () => {},
	} = options;

	_injectPermStyles();

	const dark = window.matchMedia("(prefers-color-scheme: dark)").matches;

	const dialog = document.createElement("div");
	dialog.className = "pgl-perm" + (dark ? " pgl-dk" : "");

	// Accent bar
	const accent = document.createElement("div");
	accent.className = "pgl-perm-accent";
	dialog.appendChild(accent);

	// Inner
	const inner = document.createElement("div");
	inner.className = "pgl-perm-inner";

	// Top: site + close
	const topRow = document.createElement("div");
	topRow.className = "pgl-perm-top";

	const siteEl = document.createElement("div");
	siteEl.className = "pgl-perm-site";
	siteEl.innerHTML = '<span class="pgl-perm-dot"></span><span>' + site + '</span>';

	const closeBtn = document.createElement("button");
	closeBtn.className = "pgl-perm-x";
	closeBtn.setAttribute("aria-label", "Close");
	closeBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></svg>';
	closeBtn.onclick = () => {
		dialog.style.animation = "pgl-perm-out .3s ease forwards";
		dialog.addEventListener("animationend", () => dialog.remove(), { once: true });
	};
	topRow.append(siteEl, closeBtn);
	inner.appendChild(topRow);

	// Bell icon
	const bell = document.createElement("div");
	bell.className = "pgl-perm-bell";
	bell.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="28" height="28"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>';
	inner.appendChild(bell);

	// Title
	const titleEl = document.createElement("div");
	titleEl.className = "pgl-perm-title";
	titleEl.textContent = title;
	inner.appendChild(titleEl);

	// Description
	const descEl = document.createElement("div");
	descEl.className = "pgl-perm-desc";
	descEl.textContent = description;
	inner.appendChild(descEl);

	// Feature pills
	const feats = document.createElement("div");
	feats.className = "pgl-perm-feats";
	const pills = [
		{ icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>', text: "Instant alerts" },
		{ icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>', text: "Private & secure" },
		{ icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M8 12l2 2 4-4"/></svg>', text: "Unsubscribe anytime" },
	];
	for (const p of pills) {
		const pill = document.createElement("span");
		pill.className = "pgl-perm-feat";
		pill.innerHTML = p.icon + '<span>' + p.text + '</span>';
		feats.appendChild(pill);
	}
	inner.appendChild(feats);

	// Buttons
	const btns = document.createElement("div");
	btns.className = "pgl-perm-btns";

	const btnNo = document.createElement("button");
	btnNo.className = "pgl-perm-btn pgl-perm-deny";
	btnNo.textContent = "Maybe later";
	btnNo.onclick = () => {
		onDeny();
		dialog.style.animation = "pgl-perm-out .3s ease forwards";
		dialog.addEventListener("animationend", () => dialog.remove(), { once: true });
	};

	const btnYes = document.createElement("button");
	btnYes.className = "pgl-perm-btn pgl-perm-allow";
	btnYes.textContent = "Enable notifications";
	btnYes.onclick = () => {
		onAllow();
		dialog.style.animation = "pgl-perm-out .3s ease forwards";
		dialog.addEventListener("animationend", () => dialog.remove(), { once: true });
	};

	btns.append(btnNo, btnYes);
	inner.appendChild(btns);

	// Trust footer
	const trust = document.createElement("div");
	trust.className = "pgl-perm-trust";
	trust.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg><span>Your data stays private</span>';
	inner.appendChild(trust);

	dialog.appendChild(inner);
	document.body.appendChild(dialog);

	return dialog;
}

/**
 * Ask the user for notification permission.
 * Shows a custom dialog first, then triggers the native permission prompt.
 * @param {string} endpoint - API endpoint
 * @param {string} projectId - Project ID
 * @param {string} pingletId - Pinglet signature
 */
export function askNotificationPermission(endpoint, projectId, pingletId) {
	if (!("Notification" in window)) {
		showPopup("Unsupported Browser", "Notifications not supported.", [], "🚫");
		return;
	}
	if (Notification.permission === "granted") return;
	if (Notification.permission === "denied") return;

	createNotificationPermissionDialog({
		site: window.location.hostname,
		onAllow: () => {
			Notification.requestPermission().then((permission) => {
				if (permission === "granted") {
					subscribeUser(endpoint, projectId, pingletId);
				}
			});
		},
	});
}
