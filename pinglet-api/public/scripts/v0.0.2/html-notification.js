/**
 * HTML Notification — Glassmorphism Push Notification
 * Mirrors Chrome push notification params but renders as an in-page HTML element.
 * Compatible with Pinglet SDK event tracking (window.sendNotificationEvent).
 * Exports a single function: showHtmlNotification(options)
 *
 * @typedef {Object} HtmlNotificationOptions
 * @property {string} title - Notification title
 * @property {string} [body] - Notification body text
 * @property {string} [icon] - Small icon URL (top-left, like app icon)
 * @property {string} [badge] - Badge icon URL (tiny overlay on icon)
 * @property {string} [image] - Large image displayed below the body
 * @property {Object} [media] - Rich media block
 * @property {"image"|"video"|"audio"|"iframe"} [media.type] - Media type
 * @property {string} [media.src] - Media source URL
 * @property {Array<{text: string, action: string, icon?: string}>} [buttons] - Action buttons (max 3)
 * @property {string} [domain] - Origin / domain label (defaults to window.location.hostname)
 * @property {string} [tag] - Dedupe tag — replaces existing notification with same tag
 * @property {string} [url] - Click URL — opens on notification body click
 * @property {boolean} [silent] - If true, no entrance animation
 * @property {boolean} [requireInteraction] - If true, disables auto-close
 * @property {number} [duration] - Auto-close ms (default 6000, 0 = no auto-close)
 * @property {"top-right"|"top-left"|"bottom-right"|"bottom-left"} [position] - Screen position (default "top-right")
 * @property {string} [dir] - Text direction "ltr" | "rtl"
 * @property {number} [timestamp] - Unix ms timestamp shown as relative time
 * @property {Object} [data] - Arbitrary payload forwarded to callbacks
 * @property {string} [notification_id] - Pinglet notification ID (format: "{project_id}-{timestamp}")
 * @property {string} [notification_type] - Pinglet notification type ("0"|"1"|"-1")
 * @property {(data?: Object) => void} [onClick] - Callback when notification body is clicked
 * @property {(data?: Object) => void} [onClose] - Callback when notification is dismissed
 * @property {(action: string, data?: Object) => void} [onAction] - Callback when a button is clicked
 */

const STYLE_ID = "__pinglet_html_ntfy_css__";
const CONTAINER_ID = "__pinglet_html_ntfy_container__";

/* ─── Active tag map for dedup ─── */
const _activeByTag = new Map();

/* ─── Inject styles once ─── */
function _ensureStyles() {
  if (document.getElementById(STYLE_ID)) return;
  const s = document.createElement("style");
  s.id = STYLE_ID;
  s.textContent = `
/* ── Container ── */
.pn-container{position:fixed;z-index:2147483647;display:flex;flex-direction:column;gap:12px;pointer-events:none;max-height:100vh;overflow:visible}
.pn-container.pn-top-right{top:20px;right:20px;align-items:flex-end}
.pn-container.pn-top-left{top:20px;left:20px;align-items:flex-start}
.pn-container.pn-bottom-right{bottom:20px;right:20px;align-items:flex-end;flex-direction:column-reverse}
.pn-container.pn-bottom-left{bottom:20px;left:20px;align-items:flex-start;flex-direction:column-reverse}

/* ── Card ── */
.pn-card{
  pointer-events:auto;
  width:380px;max-width:calc(100vw - 40px);
  border-radius:16px;
  background:rgba(255,255,255,0.55);
  backdrop-filter:blur(24px) saturate(1.6);
  -webkit-backdrop-filter:blur(24px) saturate(1.6);
  border:1px solid rgba(255,255,255,0.45);
  box-shadow:0 8px 32px rgba(0,0,0,0.12),0 2px 8px rgba(0,0,0,0.06),inset 0 1px 0 rgba(255,255,255,0.6);
  overflow:hidden;
  font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;
  color:#1a1a2e;
  transform:translateX(0);
  transition:opacity .3s ease,transform .3s ease;
}
.pn-card.pn-enter-right{animation:pn-slideInRight .4s cubic-bezier(.16,1,.3,1) forwards}
.pn-card.pn-enter-left{animation:pn-slideInLeft .4s cubic-bezier(.16,1,.3,1) forwards}
.pn-card.pn-exit{animation:pn-fadeOut .25s ease forwards}
.pn-card.pn-silent{animation:none;opacity:1}

/* ── Dark‐mode ── */
@media(prefers-color-scheme:dark){
  .pn-card{
    background:rgba(22,22,38,0.72);
    border:1px solid rgba(255,255,255,0.1);
    box-shadow:0 8px 32px rgba(0,0,0,0.45),0 2px 8px rgba(0,0,0,0.2),inset 0 1px 0 rgba(255,255,255,0.05);
    color:#ececf6;
  }
  .pn-header{border-color:rgba(255,255,255,0.06)}
  .pn-body-text{color:#a8a8c0!important}
  .pn-domain{color:#7878a0!important}
  .pn-time{color:#686890!important}
  .pn-icon{background:#2a2a3e!important}
  .pn-content:hover{background:rgba(255,255,255,0.03)}
  .pn-btn{background:rgba(255,255,255,0.07)!important;color:#d0d0e6!important;border-color:rgba(255,255,255,0.09)!important}
  .pn-btn:hover{background:rgba(255,255,255,0.13)!important}
  .pn-close{color:#6868908!important}
  .pn-close:hover{background:rgba(255,255,255,0.08)!important;color:#b0b0c8!important}
  .pn-progress{background:rgba(255,255,255,0.05)!important}
  .pn-progress-bar{background:rgba(140,140,200,0.3)!important}
  .pn-media img,.pn-media video,.pn-media iframe{border:1px solid rgba(255,255,255,0.06);box-sizing:border-box}
}

/* ── Keyframes ── */
@keyframes pn-slideInRight{from{opacity:0;transform:translateX(100%)}to{opacity:1;transform:translateX(0)}}
@keyframes pn-slideInLeft{from{opacity:0;transform:translateX(-100%)}to{opacity:1;transform:translateX(0)}}
@keyframes pn-fadeOut{to{opacity:0;transform:scale(.95) translateY(-8px)}}

/* ── Header row ── */
.pn-header{display:flex;align-items:center;justify-content:space-between;padding:14px 14px 0 14px}
.pn-header-left{display:flex;align-items:center;gap:8px;min-width:0}
.pn-domain{font-size:11.5px;font-weight:500;color:#6b7280;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:200px}
.pn-time{font-size:11px;color:#9ca3af;white-space:nowrap;flex-shrink:0}

/* ── Close ── */
.pn-close{
  width:26px;height:26px;border:none;background:transparent;border-radius:8px;
  display:flex;align-items:center;justify-content:center;cursor:pointer;
  color:#9ca3af;transition:background .15s,color .15s;flex-shrink:0;padding:0;
}
.pn-close:hover{background:rgba(0,0,0,0.06);color:#374151}
.pn-close svg{width:14px;height:14px}

/* ── Content ── */
.pn-content{display:flex;gap:12px;padding:12px 14px;cursor:pointer;border-radius:8px;transition:background .15s}
.pn-content:hover{background:rgba(0,0,0,0.02)}
.pn-icon{width:44px;height:44px;border-radius:10px;object-fit:cover;flex-shrink:0;background:#f0f0f5}
.pn-text-wrap{min-width:0;flex:1}
.pn-title{font-size:14px;font-weight:600;line-height:1.35;margin:0 0 3px 0;word-break:break-word}
.pn-body-text{font-size:13px;line-height:1.45;color:#4b5563;margin:0;word-break:break-word;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}

/* ── Image / Media ── */
.pn-media{padding:0 14px 4px 14px}
.pn-media img,.pn-media video,.pn-media iframe{width:100%;border-radius:10px;max-height:200px;object-fit:cover;display:block}
.pn-media audio{width:100%}

/* ── Buttons ── */
.pn-actions{display:flex;gap:8px;padding:6px 14px 14px 14px}
.pn-btn{
  flex:1;padding:8px 12px;border:1px solid rgba(0,0,0,0.06);border-radius:10px;
  background:rgba(0,0,0,0.03);font-size:12.5px;font-weight:500;color:#374151;
  cursor:pointer;transition:background .15s;text-align:center;white-space:nowrap;
  overflow:hidden;text-overflow:ellipsis;display:flex;align-items:center;justify-content:center;gap:6px;
}
.pn-btn:hover{background:rgba(0,0,0,0.07)}
.pn-btn img{width:16px;height:16px;border-radius:3px}

/* ── Progress bar ── */
.pn-progress{height:3px;background:rgba(0,0,0,0.04);border-radius:0 0 16px 16px;overflow:hidden}
.pn-progress-bar{height:100%;background:rgba(0,0,0,0.12);border-radius:0 0 16px 16px;transition:width linear}

/* ── Mobile ── */
@media(max-width:440px){
  .pn-card{width:calc(100vw - 24px);border-radius:14px}
  .pn-container.pn-top-right,.pn-container.pn-top-left{top:12px;right:12px;left:12px}
  .pn-container.pn-bottom-right,.pn-container.pn-bottom-left{bottom:12px;right:12px;left:12px}
}
`;
  document.head.appendChild(s);
}

/* ─── Get / create position container ─── */
function _getContainer(position) {
  const cls = "pn-" + position;
  let el = document.querySelector("." + CONTAINER_ID + "." + cls);
  if (el) return el;
  el = document.createElement("div");
  el.className = CONTAINER_ID + " pn-container " + cls;
  document.body.appendChild(el);
  return el;
}

/* ─── Relative time helper ─── */
function _relativeTime(ts) {
  if (!ts) return "";
  const diff = Date.now() - ts;
  if (diff < 5000) return "now";
  if (diff < 60000) return Math.floor(diff / 1000) + "s ago";
  if (diff < 3600000) return Math.floor(diff / 60000) + "m ago";
  if (diff < 86400000) return Math.floor(diff / 3600000) + "h ago";
  return Math.floor(diff / 86400000) + "d ago";
}

/* ─── Sanitize text (prevent XSS) ─── */
function _esc(str) {
  if (!str) return "";
  const d = document.createElement("div");
  d.textContent = str;
  return d.innerHTML;
}

/* ─── Sanitize URL ─── */
function _safeUrl(url) {
  if (!url) return "";
  try {
    const u = new URL(url, window.location.origin);
    if (u.protocol === "http:" || u.protocol === "https:") return u.href;
  } catch (_) {}
  return "";
}

/* ─── Fire Pinglet SDK event (compatible with widget.js) ─── */
function _fireEvent(type, card, reason) {
  if (typeof window.sendNotificationEvent !== "function") return;
  const notification_id = card.getAttribute("data-notification-id");
  if (!notification_id) return;
  const notification_type = card.getAttribute("data-notification-type") || "0";
  const [project_id, timestamp] = notification_id.split("-");
  window.sendNotificationEvent(type, {
    project_id,
    notification_id,
    timestamp,
    reason: reason || "user-dismiss",
    type: notification_type,
  });
}

/* ════════════════════════════════════════════
   Main export
   ════════════════════════════════════════════ */

/**
 * Show an HTML push-style notification with glassmorphism UI.
 * Fires Pinglet SDK tracking events (clicked/closed/dropped) via window.sendNotificationEvent.
 *
 * @param {HtmlNotificationOptions} opts
 * @returns {{ close: () => void, element: HTMLElement }} Handle to dismiss programmatically
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
    onClick = null,
    onClose = null,
    onAction = null,
  } = opts;

  /* ── Tag dedup: replace existing ── */
  if (tag && _activeByTag.has(tag)) {
    _activeByTag.get(tag).close();
  }

  const isRight = position.includes("right");
  const container = _getContainer(position);

  /* ── Card ── */
  const card = document.createElement("div");
  card.className = "pn-card" + (silent ? " pn-silent" : isRight ? " pn-enter-right" : " pn-enter-left");
  card.setAttribute("role", "alert");
  card.setAttribute("aria-live", "polite");
  if (dir === "rtl") card.style.direction = "rtl";

  /* ── Pinglet SDK tracking attributes ── */
  if (notification_id) {
    card.setAttribute("data-notification-id", notification_id);
    card.setAttribute("data-notification-type", notification_type);
  }

  /* ── Header: domain + time + close ── */
  const header = document.createElement("div");
  header.className = "pn-header";

  const headerLeft = document.createElement("div");
  headerLeft.className = "pn-header-left";

  if (badge) {
    const badgeImg = document.createElement("img");
    badgeImg.src = _safeUrl(badge);
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
  timeEl.textContent = _relativeTime(timestamp);
  headerLeft.appendChild(timeEl);

  const closeBtn = document.createElement("button");
  closeBtn.className = "pn-close";
  closeBtn.setAttribute("aria-label", "Close notification");
  closeBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></svg>';

  header.appendChild(headerLeft);
  header.appendChild(closeBtn);
  card.appendChild(header);

  /* ── Content row: icon + title/body ── */
  const content = document.createElement("div");
  content.className = "pn-content";

  if (icon) {
    const iconEl = document.createElement("img");
    iconEl.className = "pn-icon";
    iconEl.src = _safeUrl(icon);
    iconEl.alt = "";
    content.appendChild(iconEl);
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

  content.appendChild(textWrap);
  card.appendChild(content);

  /* ── Image / Media ── */
  const mediaType = media?.type || (image ? "image" : null);
  const mediaSrc = _safeUrl(media?.src || image);

  if (mediaType && mediaSrc) {
    const mediaWrap = document.createElement("div");
    mediaWrap.className = "pn-media";

    if (mediaType === "image") {
      const img = document.createElement("img");
      img.src = mediaSrc;
      img.alt = _esc(title);
      img.loading = "lazy";
      mediaWrap.appendChild(img);
    } else if (mediaType === "video") {
      const vid = document.createElement("video");
      vid.src = mediaSrc;
      vid.controls = true;
      vid.muted = true;
      vid.playsInline = true;
      vid.preload = "metadata";
      mediaWrap.appendChild(vid);
    } else if (mediaType === "audio") {
      const aud = document.createElement("audio");
      aud.src = mediaSrc;
      aud.controls = true;
      aud.preload = "metadata";
      mediaWrap.appendChild(aud);
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

  /* ── Action buttons (max 3) ── */
  const safeButtons = Array.isArray(buttons) ? buttons.slice(0, 3) : [];
  if (safeButtons.length > 0) {
    const actionsWrap = document.createElement("div");
    actionsWrap.className = "pn-actions";

    for (const btn of safeButtons) {
      const b = document.createElement("button");
      b.className = "pn-btn";
      if (btn.icon) {
        const bIcon = document.createElement("img");
        bIcon.src = _safeUrl(btn.icon);
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
        if (typeof onAction === "function") onAction(btn.action, data);
        dismiss();
      });
      actionsWrap.appendChild(b);
    }

    card.appendChild(actionsWrap);
  }

  /* ── Auto-close progress bar ── */
  const autoClose = !requireInteraction && duration > 0;
  let progressBar = null;
  let autoCloseTimer = null;
  let pausedAt = 0;
  let remaining = duration;

  if (autoClose) {
    const progressWrap = document.createElement("div");
    progressWrap.className = "pn-progress";
    progressBar = document.createElement("div");
    progressBar.className = "pn-progress-bar";
    progressBar.style.width = "100%";
    progressWrap.appendChild(progressBar);
    card.appendChild(progressWrap);
  }

  /* ── Dismiss logic ── */
  let dismissed = false;
  /** @type {"closed"|"clicked"|"dropped"} */
  let dismissReason = "closed";
  let dismissReasonText = "user-dismiss";

  function dismiss() {
    if (dismissed) return;
    dismissed = true;
    if (autoCloseTimer) clearTimeout(autoCloseTimer);
    if (tag) _activeByTag.delete(tag);

    /* Fire Pinglet SDK tracking event */
    _fireEvent(dismissReason, card, dismissReasonText);

    card.classList.add("pn-exit");
    card.addEventListener("animationend", () => {
      card.remove();
      if (container.children.length === 0) container.remove();
    }, { once: true });
    if (typeof onClose === "function") onClose(data);
  }

  /* ── Auto-close timer with pause on hover ── */
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
    const pct = (remaining / duration) * 100;
    progressBar.style.transition = "none";
    progressBar.style.width = pct + "%";
  }

  card.addEventListener("mouseenter", pauseTimer);
  card.addEventListener("mouseleave", startTimer);

  /* ── Events ── */
  closeBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    dismissReason = "closed";
    dismissReasonText = "user-dismiss";
    dismiss();
  });

  content.addEventListener("click", () => {
    dismissReason = "clicked";
    dismissReasonText = "user-click";
    if (typeof onClick === "function") onClick(data);
    const safeLink = _safeUrl(url);
    if (safeLink) window.open(safeLink, "_blank", "noopener,noreferrer");
    dismiss();
  });

  /* ── Mount ── */
  container.appendChild(card);
  if (tag) _activeByTag.set(tag, { close: dismiss });

  /* Kick off auto-close */
  requestAnimationFrame(() => {
    startTimer();
  });

  /**
   * Programmatic close with optional reason.
   * @param {"clicked"|"closed"|"dropped"} [reason="closed"]
   * @param {string} [reasonText="programmatic"]
   */
  function closeWithReason(reason, reasonText) {
    dismissReason = reason || "closed";
    dismissReasonText = reasonText || "programmatic";
    dismiss();
  }

  return { close: closeWithReason, element: card };
}
