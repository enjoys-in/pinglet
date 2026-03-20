/**
 * Pinglet SDK v0.0.3 — Glassmorphism Notification
 * The only notification renderer for v0.0.3.
 * Type 0: Full SDK-built content (title, body, icon, media, buttons).
 * Type 1: User-provided template element inside the glass container.
 * Container provides: positioning, stacking, dark mode, branding, progress bar,
 * auto-close, pause-on-hover, tag dedup, dismiss, tracking events.
 */

import { fireTrackingEvent } from "./events.js";
import { escapeHtml, relativeTime, safeUrl } from "./utils.js";
import { audioPlayerElement } from "./audio-player.js";
import { videoPlayerElement } from "./video-player.js";

const STYLE_ID = "__pinglet_html_ntfy_css__";
const CONTAINER_ID = "__pinglet_html_ntfy_container__";

const _activeByTag = new Map();
const _activeByPosition = new Map();
const _queueByPosition = new Map();
const _prefetchedUrls = new Set();

// ─── Inject global styles once ───

function _ensureStyles() {
	if (document.getElementById(STYLE_ID)) return;
	const s = document.createElement("style");
	s.id = STYLE_ID;
	s.textContent = `
/* Container */
.pn-container{position:fixed;z-index:2147483647;display:flex;flex-direction:column;gap:12px;pointer-events:none;max-height:100vh;overflow:visible}
.pn-container.pn-top-right{top:20px;right:20px;align-items:flex-end}
.pn-container.pn-top-left{top:20px;left:20px;align-items:flex-start}
.pn-container.pn-bottom-right{bottom:20px;right:20px;align-items:flex-end;flex-direction:column-reverse}
.pn-container.pn-bottom-left{bottom:20px;left:20px;align-items:flex-start;flex-direction:column-reverse}

/* Card — Light */
.pn-card{
  pointer-events:auto;width:380px;max-width:calc(100vw - 40px);border-radius:16px;
  background:rgba(255,255,255,0.55);backdrop-filter:blur(24px) saturate(1.6);
  -webkit-backdrop-filter:blur(24px) saturate(1.6);
  border:1px solid rgba(255,255,255,0.45);
  box-shadow:0 8px 32px rgba(0,0,0,0.12),0 2px 8px rgba(0,0,0,0.06),inset 0 1px 0 rgba(255,255,255,0.6);
  overflow:hidden;font-family:'Manrope',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;
  color:#1a1a2e;transform:translateX(0);transition:opacity .3s ease,transform .3s ease;
}
.pn-card.pn-enter-right{animation:pn-slideInRight .4s cubic-bezier(.16,1,.3,1) forwards}
.pn-card.pn-enter-left{animation:pn-slideInLeft .4s cubic-bezier(.16,1,.3,1) forwards}
.pn-card.pn-exit{animation:pn-fadeOut .25s ease forwards}
.pn-card.pn-silent{animation:none;opacity:1}

/* Card — Dark */
.pn-card.pn-dark{
  background:rgba(22,22,38,0.72);border:1px solid rgba(255,255,255,0.1);
  box-shadow:0 8px 32px rgba(0,0,0,0.45),0 2px 8px rgba(0,0,0,0.2),inset 0 1px 0 rgba(255,255,255,0.05);
  color:#ececf6;
}
.pn-dark .pn-header{border-color:rgba(255,255,255,0.06)}
.pn-dark .pn-body-text{color:#a8a8c0!important}
.pn-dark .pn-domain{color:#7878a0!important}
.pn-dark .pn-time{color:#686890!important}
.pn-dark .pn-icon{background:#2a2a3e!important}
.pn-dark .pn-content:hover{background:rgba(255,255,255,0.03)}
.pn-dark .pn-btn{background:rgba(255,255,255,0.07)!important;color:#d0d0e6!important;border-color:rgba(255,255,255,0.09)!important}
.pn-dark .pn-btn:hover{background:rgba(255,255,255,0.13)!important}
.pn-dark .pn-close{color:#686890!important}
.pn-dark .pn-close:hover{background:rgba(255,255,255,0.08)!important;color:#b0b0c8!important}
.pn-dark .pn-progress{background:rgba(255,255,255,0.05)!important}
.pn-dark .pn-progress-bar{background:rgba(140,140,200,0.3)!important}
.pn-dark .pn-media img,.pn-dark .pn-media video,.pn-dark .pn-media iframe{border:1px solid rgba(255,255,255,0.06);box-sizing:border-box}

/* Keyframes */
@keyframes pn-slideInRight{from{opacity:0;transform:translateX(100%)}to{opacity:1;transform:translateX(0)}}
@keyframes pn-slideInLeft{from{opacity:0;transform:translateX(-100%)}to{opacity:1;transform:translateX(0)}}
@keyframes pn-fadeOut{to{opacity:0;transform:scale(.95) translateY(-8px)}}
@keyframes pn-replaceIn{from{opacity:0;transform:scale(0.97)}to{opacity:1;transform:scale(1)}}
.pn-card.pn-replace{animation:pn-replaceIn .25s cubic-bezier(.16,1,.3,1) forwards}

/* Header */
.pn-header{display:flex;align-items:center;justify-content:space-between;padding:14px 14px 0 14px}
.pn-header-left{display:flex;align-items:center;gap:8px;min-width:0}
.pn-domain{font-size:11.5px;font-weight:500;color:#6b7280;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:200px}
.pn-time{font-size:11px;color:#9ca3af;white-space:nowrap;flex-shrink:0}

/* Close */
.pn-close{
  width:26px;height:26px;border:none;background:transparent;border-radius:8px;
  display:flex;align-items:center;justify-content:center;cursor:pointer;
  color:#9ca3af;transition:background .15s,color .15s;flex-shrink:0;padding:0;
}
.pn-close:hover{background:rgba(0,0,0,0.06);color:#374151}
.pn-close svg{width:14px;height:14px}

/* Content */
.pn-content{display:flex;gap:12px;padding:12px 14px;cursor:pointer;border-radius:8px;transition:background .15s}
.pn-content:hover{background:rgba(0,0,0,0.02)}
.pn-icon{width:44px;height:44px;border-radius:10px;object-fit:cover;flex-shrink:0;background:#f0f0f5}
.pn-text-wrap{min-width:0;flex:1}
.pn-title{font-size:14px;font-weight:600;line-height:1.35;margin:0 0 3px 0;word-break:break-word}
.pn-body-text{font-size:13px;line-height:1.45;color:#4b5563;margin:0;word-break:break-word;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}

/* Media */
.pn-media{padding:0 14px 4px 14px}
.pn-media img,.pn-media video,.pn-media iframe{width:100%;border-radius:10px;max-height:200px;object-fit:cover;display:block}
.pn-media audio{width:100%}

/* Buttons */
.pn-actions{display:flex;gap:8px;padding:6px 14px 14px 14px}
.pn-btn{
  flex:1;padding:8px 12px;border:1px solid rgba(0,0,0,0.06);border-radius:10px;
  background:rgba(0,0,0,0.03);font-size:12.5px;font-weight:500;color:#374151;
  cursor:pointer;transition:background .15s;text-align:center;white-space:nowrap;
  overflow:hidden;text-overflow:ellipsis;display:flex;align-items:center;justify-content:center;gap:6px;
}
.pn-btn:hover{background:rgba(0,0,0,0.07)}
.pn-btn img{width:16px;height:16px;border-radius:3px}

/* Progress bar */
.pn-progress{height:3px;background:rgba(0,0,0,0.04);border-radius:0 0 16px 16px;overflow:hidden}
.pn-progress-bar{height:100%;background:rgba(0,0,0,0.12);border-radius:0 0 16px 16px;transition:width linear}

/* Branding */
.pn-branding{padding:4px 14px 10px;text-align:right;font-size:10.5px;color:#9ca3af;pointer-events:auto;line-height:1.3}
.pn-branding a{color:#4da6ff;text-decoration:none;font-weight:500}
.pn-branding a:hover{text-decoration:underline}
.pn-dark .pn-branding{color:#686890}
.pn-dark .pn-branding a{color:#6da8e0}

/* Custom template content */
.pn-custom{padding:12px 14px;pointer-events:auto}

/* Mobile */
@media(max-width:440px){
  .pn-card{width:calc(100vw - 24px);border-radius:14px}
  .pn-container.pn-top-right,.pn-container.pn-top-left{top:12px;right:12px;left:12px}
  .pn-container.pn-bottom-right,.pn-container.pn-bottom-left{bottom:12px;right:12px;left:12px}
}`;
	document.head.appendChild(s);
}

// ─── Container per position ───

function _getContainer(position) {
	const cls = "pn-" + position;
	let el = document.querySelector("." + CONTAINER_ID + "." + cls);
	if (el) return el;
	el = document.createElement("div");
	el.className = CONTAINER_ID + " pn-container " + cls;
	document.body.appendChild(el);
	return el;
}

// ─── Main Export ───

/**
 * @typedef {Object} HtmlNotificationOptions
 * @property {string} title
 * @property {string} [body]
 * @property {string} [icon]
 * @property {string} [badge]
 * @property {string} [image]
 * @property {{ type: "image"|"video"|"audio"|"iframe", src: string }} [media]
 * @property {Array<{ text: string, action: string, icon?: string }>} [buttons]
 * @property {string} [domain]
 * @property {string} [tag]
 * @property {string} [url]
 * @property {boolean} [silent]
 * @property {boolean} [requireInteraction]
 * @property {number} [duration]
 * @property {"top-right"|"top-left"|"bottom-right"|"bottom-left"} [position]
 * @property {string} [dir]
 * @property {number} [timestamp]
 * @property {Object} [data]
 * @property {string} [notification_id]
 * @property {string} [notification_type]
 * @property {"light"|"dark"|"auto"} [theme]
 * @property {{ show?: boolean, html?: string }} [branding]
 * @property {number} [maxVisible]
 * @property {HTMLElement} [customContent] - User-provided template element (type 1). When set, replaces SDK-built content.
 * @property {(data?: Object) => void} [onClick]
 * @property {(data?: Object) => void} [onClose]
 * @property {(action: string, data?: Object) => void} [onAction]
 */

/**
 * Show a glassmorphism HTML notification.
 * @param {HtmlNotificationOptions} opts
 * @returns {{ close: (reason?: string, reasonText?: string) => void, element: HTMLElement }}
 */
export function showHtmlNotification(opts = {}) {
	_ensureStyles();

	const {
		title = "",
		body = "",
		icon = "",
		badge = "",
		image = "",
		media = null,
		buttons = [],
		domain = window.location.hostname,
		tag = "",
		url = "",
		silent = false,
		requireInteraction = false,
		duration = 6000,
		position = "top-right",
		dir = "ltr",
		timestamp = Date.now(),
		data = {},
		notification_id = "",
		notification_type = "0",
		theme = "auto",
		branding = null,
		maxVisible = 3,
		customContent = null,
		onClick = null,
		onClose = null,
		onAction = null,
	} = opts;

	// Tag dedup — smooth crossfade replacement
	let isTagReplace = false;
	if (tag && _activeByTag.has(tag)) {
		isTagReplace = true;
		const entry = _activeByTag.get(tag);
		if (entry.element) {
			// Quick fade-out for smooth transition
			const oldCard = entry.element;
			oldCard.style.transition = "opacity 0.15s ease, transform 0.15s ease";
			oldCard.style.opacity = "0";
			oldCard.style.transform += " scale(0.98)";
			// Remove from position tracking (new card will take its slot)
			for (const [pos, list] of _activeByPosition) {
				const idx = list.indexOf(oldCard);
				if (idx !== -1) { list.splice(idx, 1); break; }
			}
			setTimeout(() => {
				oldCard.remove();
				const container = oldCard.parentElement;
				if (container && container.children.length === 0) container.remove();
			}, 160);
		}
		_activeByTag.delete(tag);
	}

	// Stacking: queue if over maxVisible
	if (!_activeByPosition.has(position)) _activeByPosition.set(position, []);
	if (!_queueByPosition.has(position)) _queueByPosition.set(position, []);
	const _activeList = _activeByPosition.get(position);
	if (_activeList.length >= maxVisible) {
		_queueByPosition.get(position).push(opts);
		return { close: () => {}, element: null };
	}

	// Prefetch icon for browser cache
	if (icon) {
		const safeIcon = safeUrl(icon);
		if (safeIcon && !_prefetchedUrls.has(safeIcon)) {
			_prefetchedUrls.add(safeIcon);
			const link = document.createElement("link");
			link.rel = "prefetch";
			link.as = "image";
			link.href = safeIcon;
			document.head.appendChild(link);
		}
	}

	// Dark mode from explicit theme param
	const dark =
		theme === "dark" ||
		(theme === "auto" && window.matchMedia("(prefers-color-scheme: dark)").matches);
	const isRight = position.includes("right");
	const container = _getContainer(position);

	// Card
	const card = document.createElement("div");
	const enterCls = silent ? " pn-silent" : isTagReplace ? " pn-replace" : isRight ? " pn-enter-right" : " pn-enter-left";
	card.className = "pn-card" + enterCls + (dark ? " pn-dark" : "");
	card.setAttribute("role", "alert");
	card.setAttribute("aria-live", "polite");
	if (dir === "rtl") card.style.direction = "rtl";

	// Tracking data attributes
	if (notification_id) {
		card.setAttribute("data-notification-id", notification_id);
		card.setAttribute("data-notification-type", notification_type);
	}

	// ─ Header ─
	const header = document.createElement("div");
	header.className = "pn-header";
	const headerLeft = document.createElement("div");
	headerLeft.className = "pn-header-left";

	if (badge) {
		const badgeImg = document.createElement("img");
		badgeImg.src = safeUrl(badge);
		badgeImg.alt = "";
		badgeImg.style.cssText = "width:14px;height:14px;border-radius:3px;flex-shrink:0";
		headerLeft.appendChild(badgeImg);
	}

	const domainEl = document.createElement("span");
	domainEl.className = "pn-domain";
	domainEl.textContent = domain;
	headerLeft.appendChild(domainEl);

	const timeEl = document.createElement("span");
	timeEl.className = "pn-time";
	timeEl.textContent = relativeTime(timestamp);
	headerLeft.appendChild(timeEl);

	const closeBtn = document.createElement("button");
	closeBtn.className = "pn-close";
	closeBtn.setAttribute("aria-label", "Close notification");
	closeBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></svg>';

	header.append(headerLeft, closeBtn);
	card.appendChild(header);

	// ─ Content (SDK-built or custom template) ─
	let contentEl = null;

	let _videoGetDuration = null;

	if (customContent) {
		// Type 1 template: user-provided element inside glass container
		const customWrap = document.createElement("div");
		customWrap.className = "pn-custom";
		customWrap.appendChild(customContent);
		card.appendChild(customWrap);
	} else {
		// Type 0 default: SDK-built content
		contentEl = document.createElement("div");
		contentEl.className = "pn-content";

		if (icon) {
			const iconEl = document.createElement("img");
			iconEl.className = "pn-icon";
			iconEl.src = safeUrl(icon);
			iconEl.alt = "";
			iconEl.decoding = "async";
			contentEl.appendChild(iconEl);
		}

		const textWrap = document.createElement("div");
		textWrap.className = "pn-text-wrap";
		if (title) {
			const titleEl = document.createElement("p");
			titleEl.className = "pn-title";
			titleEl.textContent = title;
			textWrap.appendChild(titleEl);
		}
		if (body) {
			const bodyEl = document.createElement("p");
			bodyEl.className = "pn-body-text";
			bodyEl.textContent = body;
			textWrap.appendChild(bodyEl);
		}
		contentEl.appendChild(textWrap);
		card.appendChild(contentEl);

		// ─ Media ─
		const mediaType = media?.type || (image ? "image" : null);
		const mediaSrc = safeUrl(media?.src || image);
		if (mediaType && mediaSrc) {
			const mediaWrap = document.createElement("div");
			mediaWrap.className = "pn-media";

			if (mediaType === "image") {
				const img = document.createElement("img");
				img.src = mediaSrc;
				img.alt = escapeHtml(title);
				img.loading = "lazy";
				img.decoding = "async";
				mediaWrap.appendChild(img);
			} else if (mediaType === "video") {
				const vp = videoPlayerElement(mediaSrc, true, dark);
				mediaWrap.appendChild(vp.element);
				_videoGetDuration = vp.getDuration;
			} else if (mediaType === "audio") {
				mediaWrap.appendChild(audioPlayerElement(mediaSrc, false, false, false, dark));
			} else if (mediaType === "iframe") {
				const ifr = document.createElement("iframe");
				ifr.src = mediaSrc;
				ifr.style.cssText = "height:180px;border:none";
				ifr.setAttribute("sandbox", "allow-scripts allow-same-origin");
				ifr.loading = "lazy";
				mediaWrap.appendChild(ifr);
			}
			card.appendChild(mediaWrap);
		}

		// ─ Buttons (max 3) ─
		const safeButtons = Array.isArray(buttons) ? buttons.slice(0, 3) : [];
		if (safeButtons.length > 0) {
			const actionsWrap = document.createElement("div");
			actionsWrap.className = "pn-actions";

			for (const btn of safeButtons) {
				const b = document.createElement("button");
				b.className = "pn-btn";
				if (btn.icon) {
					const bIcon = document.createElement("img");
					bIcon.src = safeUrl(btn.icon);
					bIcon.alt = "";
					b.appendChild(bIcon);
				}
				const bText = document.createElement("span");
				bText.textContent = btn.text || btn.action || "";
				b.appendChild(bText);

				b.addEventListener("click", (e) => {
					e.stopPropagation();
					dismissReason = "clicked";
					dismissReasonText = "action:" + (btn.action || btn.text || "");

					// Custom event dispatch — action: "event"
					if (btn.action === "event") {
						const evtName = btn.event || btn.eventName || btn.src;
						if (evtName) {
							const detail = btn.payload || btn.data || {};
							window.dispatchEvent(
								new CustomEvent(evtName, { detail }),
							);
						}
					}

					if (typeof onAction === "function") onAction(btn.action, { ...data, ...(btn.payload || {}) });
					dismiss();
				});
				actionsWrap.appendChild(b);
			}
			card.appendChild(actionsWrap);
		}
	}

	// ─ Branding footer ─
	if (branding && branding.show !== false) {
		const brandEl = document.createElement("div");
		brandEl.className = "pn-branding";
		brandEl.innerHTML = branding.html || 'Notifications by <a href="https://pinglet.enjoys.in" target="_blank" rel="noopener noreferrer">Pinglet</a>';
		card.appendChild(brandEl);
	}

	// ─ Progress bar ─
	// If there's a video, extend the timer to 30 seconds
	let _effectiveDuration = duration;
	if (_videoGetDuration) {
		_effectiveDuration = 30000;
	}
	const autoClose = !requireInteraction && _effectiveDuration > 0;
	let progressBar = null;
	let autoCloseTimer = null;
	let pausedAt = 0;
	let remaining = _effectiveDuration;

	if (autoClose) {
		const progressWrap = document.createElement("div");
		progressWrap.className = "pn-progress";
		progressBar = document.createElement("div");
		progressBar.className = "pn-progress-bar";
		progressBar.style.width = "100%";
		progressWrap.appendChild(progressBar);
		card.appendChild(progressWrap);
	}

	// ─ Dismiss logic ─
	let dismissed = false;
	let dismissReason = "closed";
	let dismissReasonText = "user-dismiss";

	function dismiss() {
		if (dismissed) return;
		dismissed = true;
		if (autoCloseTimer) clearTimeout(autoCloseTimer);
		if (tag) _activeByTag.delete(tag);

		// Remove from active stack
		const posActive = _activeByPosition.get(position);
		if (posActive) {
			const idx = posActive.indexOf(card);
			if (idx !== -1) posActive.splice(idx, 1);
		}

		fireTrackingEvent(dismissReason, card, dismissReasonText);

		card.classList.add("pn-exit");
		card.addEventListener("animationend", () => {
			card.remove();
			if (container.children.length === 0) container.remove();
			// Dequeue next notification for this position
			const queue = _queueByPosition.get(position);
			if (queue && queue.length > 0) {
				const nextOpts = queue.shift();
				showHtmlNotification(nextOpts);
			}
		}, { once: true });
		if (typeof onClose === "function") onClose(data);
	}

	// ─ Timer with hover pause ─
	function startTimer() {
		if (!autoClose) return;
		pausedAt = Date.now();
		progressBar.style.transition = "width " + remaining + "ms linear";
		progressBar.style.width = "0%";
		autoCloseTimer = setTimeout(() => {
			dismissReason = "dropped";
			dismissReasonText = "auto-dismiss";
			dismiss();
		}, remaining);
	}

	function pauseTimer() {
		if (!autoClose || dismissed) return;
		clearTimeout(autoCloseTimer);
		const elapsed = Date.now() - pausedAt;
		remaining = Math.max(remaining - elapsed, 200);
		const pct = (remaining / _effectiveDuration) * 100;
		progressBar.style.transition = "none";
		progressBar.style.width = pct + "%";
	}

	card.addEventListener("mouseenter", pauseTimer);
	card.addEventListener("mouseleave", startTimer);

	// ─ Events ─
	closeBtn.addEventListener("click", (e) => {
		e.stopPropagation();
		dismissReason = "closed";
		dismissReasonText = "user-dismiss";
		dismiss();
	});

	if (contentEl) {
		contentEl.addEventListener("click", () => {
			dismissReason = "clicked";
			dismissReasonText = "user-click";
			if (typeof onClick === "function") onClick(data);
			const safeLink = safeUrl(url);
			if (safeLink) window.open(safeLink, "_blank", "noopener,noreferrer");
			dismiss();
		});
	}

	// ─ Mount ─
	container.appendChild(card);
	_activeList.push(card);
	if (tag) _activeByTag.set(tag, { close: dismiss });
	requestAnimationFrame(() => startTimer());

	function closeWithReason(reason, reasonText) {
		dismissReason = reason || "closed";
		dismissReasonText = reasonText || "programmatic";
		dismiss();
	}

	return { close: closeWithReason, element: card };
}
