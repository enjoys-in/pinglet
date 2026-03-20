/**
 * Pinglet SDK v0.0.3 — System Popup / Error Toast
 * Modern frosted-glass error & system popups with Raleway + Lato fonts.
 * Supports dark/light mode via system preference.
 */

/** @typedef {import('./types/index.js').ButtonData} ButtonData */

const POPUP_STYLE_ID = "__pinglet_popup_css__";
const POPUP_FONT_ID = "__pinglet_popup_font__";

function _injectPopupStyles() {
	if (document.getElementById(POPUP_STYLE_ID)) return;

	// Fonts
	if (!document.getElementById(POPUP_FONT_ID)) {
		const link = document.createElement("link");
		link.id = POPUP_FONT_ID;
		link.rel = "stylesheet";
		link.href = "https://fonts.googleapis.com/css2?family=Raleway:wght@400;500;600;700&family=Lato:wght@300;400;700&display=swap";
		document.head.appendChild(link);
	}

	const s = document.createElement("style");
	s.id = POPUP_STYLE_ID;
	s.textContent = `
/* Popup container */
.pgl-pop-wrap{position:fixed;bottom:20px;right:20px;z-index:2147483647;display:flex;flex-direction:column;gap:10px;
  align-items:flex-end;pointer-events:none;max-width:400px}
/* Card — Light */
.pgl-pop{pointer-events:auto;width:360px;max-width:calc(100vw - 40px);border-radius:16px;overflow:hidden;
  background:rgba(255,255,255,0.88);backdrop-filter:blur(24px) saturate(1.5);-webkit-backdrop-filter:blur(24px) saturate(1.5);
  border:1px solid rgba(255,255,255,0.55);box-shadow:0 12px 40px rgba(0,0,0,0.10),0 2px 10px rgba(0,0,0,0.04);
  font-family:'Lato','Raleway',sans-serif;color:#1c1c2e;
  opacity:0;transform:translateX(60px);animation:pgl-pop-in .4s cubic-bezier(.22,1,.36,1) forwards}
/* Card — Dark */
.pgl-pop.pgl-pop-dk{background:rgba(16,16,28,0.92);border:1px solid rgba(255,255,255,0.07);
  box-shadow:0 12px 40px rgba(0,0,0,0.45),0 2px 10px rgba(0,0,0,0.2);color:#e0e0ef}
/* Severity bar */
.pgl-pop-bar{height:3px;border-radius:16px 16px 0 0}
.pgl-pop-bar.pgl-err{background:linear-gradient(90deg,#ef4444,#f97316)}
.pgl-pop-bar.pgl-warn{background:linear-gradient(90deg,#f59e0b,#eab308)}
.pgl-pop-bar.pgl-info{background:linear-gradient(90deg,#6366f1,#8b5cf6)}
.pgl-pop-bar.pgl-ok{background:linear-gradient(90deg,#22c55e,#10b981)}
/* Anim */
@keyframes pgl-pop-in{to{opacity:1;transform:translateX(0)}}
@keyframes pgl-pop-out{to{opacity:0;transform:translateX(40px) scale(0.96)}}
@keyframes pgl-pop-shake{0%,100%{transform:translateX(0)}10%,30%,50%{transform:translateX(-3px)}20%,40%{transform:translateX(3px)}}
/* Inner */
.pgl-pop-inner{padding:16px 18px 14px}
/* Header */
.pgl-pop-head{display:flex;align-items:flex-start;gap:12px}
.pgl-pop-icon{width:40px;height:40px;border-radius:12px;display:flex;align-items:center;justify-content:center;
  font-size:20px;flex-shrink:0;line-height:1}
.pgl-pop-icon.pgl-err{background:rgba(239,68,68,0.10)}
.pgl-pop-icon.pgl-warn{background:rgba(245,158,11,0.10)}
.pgl-pop-icon.pgl-info{background:rgba(99,102,241,0.10)}
.pgl-pop-icon.pgl-ok{background:rgba(34,197,94,0.10)}
.pgl-pop-dk .pgl-pop-icon.pgl-err{background:rgba(239,68,68,0.15)}
.pgl-pop-dk .pgl-pop-icon.pgl-warn{background:rgba(245,158,11,0.15)}
.pgl-pop-dk .pgl-pop-icon.pgl-info{background:rgba(99,102,241,0.18)}
.pgl-pop-dk .pgl-pop-icon.pgl-ok{background:rgba(34,197,94,0.15)}
.pgl-pop-text{flex:1;min-width:0}
.pgl-pop-title{font-family:'Raleway',sans-serif;font-size:14.5px;font-weight:700;margin:0 0 3px;line-height:1.35;letter-spacing:-0.1px}
.pgl-pop-desc{font-family:'Lato',sans-serif;font-size:12.5px;font-weight:400;color:#6b7280;line-height:1.5;margin:0;
  display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
.pgl-pop-dk .pgl-pop-desc{color:#8b8ba0}
.pgl-pop-close{width:26px;height:26px;border:none;border-radius:8px;cursor:pointer;display:flex;align-items:center;justify-content:center;
  background:transparent;color:#a1a1aa;transition:all .15s;flex-shrink:0;padding:0;margin-top:-2px}
.pgl-pop-close:hover{background:rgba(0,0,0,0.05);color:#52525b}
.pgl-pop-dk .pgl-pop-close{color:#5c5c72}
.pgl-pop-dk .pgl-pop-close:hover{background:rgba(255,255,255,0.08);color:#a5a5bf}
.pgl-pop-close svg{width:12px;height:12px}
/* Buttons */
.pgl-pop-btns{display:flex;gap:8px;margin-top:14px}
.pgl-pop-btn{flex:1;padding:8px 14px;border-radius:10px;font-family:'Raleway',sans-serif;font-size:12px;font-weight:600;
  cursor:pointer;transition:all .15s;border:none;text-align:center;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.pgl-pop-btn-primary{background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;box-shadow:0 2px 8px rgba(99,102,241,0.25)}
.pgl-pop-btn-primary:hover{box-shadow:0 4px 14px rgba(99,102,241,0.35);transform:translateY(-1px)}
.pgl-pop-btn-sec{background:rgba(0,0,0,0.04);color:#52525b;border:1px solid rgba(0,0,0,0.06)}
.pgl-pop-btn-sec:hover{background:rgba(0,0,0,0.07)}
.pgl-pop-dk .pgl-pop-btn-sec{background:rgba(255,255,255,0.06);color:#c0c0d6;border-color:rgba(255,255,255,0.08)}
.pgl-pop-dk .pgl-pop-btn-sec:hover{background:rgba(255,255,255,0.10)}
/* Footer */
.pgl-pop-footer{display:flex;align-items:center;justify-content:space-between;padding:0 18px 12px;font-size:10.5px;color:#a1a1aa}
.pgl-pop-dk .pgl-pop-footer{color:#4e4e64}
.pgl-pop-footer a{color:#6366f1;text-decoration:none;font-weight:500}
.pgl-pop-dk .pgl-pop-footer a{color:#818cf8}
.pgl-pop-footer a:hover{text-decoration:underline}
/* Progress */
.pgl-pop-progress{height:2px;background:rgba(0,0,0,0.04);margin:0 18px 0;border-radius:2px;overflow:hidden}
.pgl-pop-dk .pgl-pop-progress{background:rgba(255,255,255,0.04)}
.pgl-pop-progress-bar{height:100%;border-radius:2px;transition:width linear}
.pgl-pop-progress-bar.pgl-err{background:rgba(239,68,68,0.5)}
.pgl-pop-progress-bar.pgl-warn{background:rgba(245,158,11,0.5)}
.pgl-pop-progress-bar.pgl-info{background:rgba(99,102,241,0.4)}
.pgl-pop-progress-bar.pgl-ok{background:rgba(34,197,94,0.4)}
/* Mobile */
@media(max-width:440px){.pgl-pop-wrap{right:12px;bottom:12px}.pgl-pop{width:calc(100vw - 24px)}}
`;
	document.head.appendChild(s);
}

/**
 * Button action handler for popup buttons.
 * @param {ButtonData} btn
 * @param {HTMLElement} toast - Parent toast element
 */
export function handleButtonAction(btn, toast) {
	switch (btn.action) {
		case "redirect":
		case "open":
			return window.open(btn.src, "_blank", "noopener,noreferrer");
		case "link":
			return window.open(btn.src);
		case "alert":
			return alert(btn.src);
		case "reload":
			return window.location.reload();
		case "event": {
			const name = btn.event || btn.eventName || btn.src;
			if (!name) {
				console.warn("[Pinglet] Button action 'event' requires an event name (event, eventName, or src).");
				return;
			}
			const detail = btn.payload || btn.data || {};
			return window.dispatchEvent(
				new CustomEvent(name, { detail }),
			);
		}
		case "close":
		case "dismiss":
			return window.dispatchEvent(
				new CustomEvent("pinglet:notificationClosed", {
					detail: { contentEl: toast, reason: "user-dismiss" },
				}),
			);
		default:
			return window.open("https://pinglet.enjoys.in/docs", "_blank", "noopener,noreferrer");
	}
}

// Detect severity from icon emoji
function _severity(icon) {
	if (!icon) return "err";
	const s = String(icon);
	if (s.includes("❌") || s.includes("🔴") || s.includes("💀")) return "err";
	if (s.includes("⚠") || s.includes("🟡") || s.includes("🟠")) return "warn";
	if (s.includes("✅") || s.includes("🟢") || s.includes("🎉")) return "ok";
	return "info";
}

/**
 * Show a system popup toast.
 * @param {string} title - Popup title
 * @param {string} [description] - Popup description
 * @param {Array<ButtonData>} [buttons] - Action buttons
 * @param {string} [icon="⚠️"] - Icon emoji
 * @param {{ duration: number, auto_dismiss: boolean }} [options]
 * @returns {HTMLElement}
 */
export function showPopup(
	title,
	description,
	buttons = [
		{
			text: "See Docs",
			action: "redirect",
			src: "https://pinglet.enjoys.in/docs",
		},
	],
	icon = "⚠️",
	options = { duration: 6000, auto_dismiss: true },
) {
	_injectPopupStyles();

	const dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
	const sev = _severity(icon);
	const containerId = "pgl-pop-wrap";
	let container = document.getElementById(containerId);

	if (!container) {
		container = document.createElement("div");
		container.id = containerId;
		container.className = "pgl-pop-wrap";
		document.body.appendChild(container);
	}

	// Card
	const card = document.createElement("div");
	card.className = "pgl-pop" + (dark ? " pgl-pop-dk" : "");

	// Severity bar
	const bar = document.createElement("div");
	bar.className = "pgl-pop-bar " + sev;
	card.appendChild(bar);

	// Inner
	const inner = document.createElement("div");
	inner.className = "pgl-pop-inner";

	// Head row: icon + text + close
	const head = document.createElement("div");
	head.className = "pgl-pop-head";

	const iconEl = document.createElement("div");
	iconEl.className = "pgl-pop-icon " + sev;
	iconEl.textContent = icon;

	const textCol = document.createElement("div");
	textCol.className = "pgl-pop-text";

	const titleEl = document.createElement("div");
	titleEl.className = "pgl-pop-title";
	titleEl.textContent = title;
	textCol.appendChild(titleEl);

	if (description) {
		const descEl = document.createElement("div");
		descEl.className = "pgl-pop-desc";
		descEl.textContent = description;
		textCol.appendChild(descEl);
	}

	const closeBtn = document.createElement("button");
	closeBtn.className = "pgl-pop-close";
	closeBtn.setAttribute("aria-label", "Close");
	closeBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></svg>';

	head.append(iconEl, textCol, closeBtn);
	inner.appendChild(head);

	// Buttons
	if (Array.isArray(buttons) && buttons.length) {
		const btnRow = document.createElement("div");
		btnRow.className = "pgl-pop-btns";

		buttons.forEach((btn, i) => {
			const btnEl = document.createElement("button");
			btnEl.className = "pgl-pop-btn " + (i === 0 ? "pgl-pop-btn-primary" : "pgl-pop-btn-sec");
			btnEl.textContent = btn.text || "Click Here";

			if (btn?.onClick) {
				try {
					const func = new Function(`return ${btn.onClick}`)();
					if (typeof func === "function") btnEl.addEventListener("click", func);
				} catch (e) {
					console.warn("[Pinglet] Invalid onClick handler:", e);
				}
			} else {
				btnEl.addEventListener("click", (e) => {
					e.stopPropagation();
					handleButtonAction(btn, card);
					dismiss();
				});
			}
			btnRow.appendChild(btnEl);
		});
		inner.appendChild(btnRow);
	}

	card.appendChild(inner);

	// Progress bar (auto-dismiss)
	const duration = options.duration || 6000;
	const autoClose = options.auto_dismiss !== false;
	let progressBar = null;

	if (autoClose) {
		const progressWrap = document.createElement("div");
		progressWrap.className = "pgl-pop-progress";
		progressBar = document.createElement("div");
		progressBar.className = "pgl-pop-progress-bar " + sev;
		progressBar.style.width = "100%";
		progressWrap.appendChild(progressBar);
		card.appendChild(progressWrap);
	}

	// Footer
	const footer = document.createElement("div");
	footer.className = "pgl-pop-footer";
	const timeEl = document.createElement("span");
	timeEl.textContent = "just now";
	const brandEl = document.createElement("span");
	brandEl.innerHTML = 'by <a href="https://pinglet.enjoys.in" target="_blank" rel="noopener noreferrer">Enjoys</a>';
	footer.append(timeEl, brandEl);
	card.appendChild(footer);

	// Dismiss
	let dismissed = false;
	let timer = null;
	let pausedAt = 0;
	let remaining = duration;

	function dismiss() {
		if (dismissed) return;
		dismissed = true;
		if (timer) clearTimeout(timer);
		card.style.animation = "pgl-pop-out .3s ease forwards";
		card.addEventListener("animationend", () => card.remove(), { once: true });
	}

	closeBtn.addEventListener("click", (e) => {
		e.stopPropagation();
		dismiss();
	});

	// Auto-close with hover pause
	function startTimer() {
		if (!autoClose || dismissed) return;
		pausedAt = Date.now();
		if (progressBar) {
			progressBar.style.transition = "width " + remaining + "ms linear";
			progressBar.style.width = "0%";
		}
		timer = setTimeout(dismiss, remaining);
	}

	function pauseTimer() {
		if (!autoClose || dismissed) return;
		clearTimeout(timer);
		const elapsed = Date.now() - pausedAt;
		remaining = Math.max(remaining - elapsed, 200);
		if (progressBar) {
			const pct = (remaining / duration) * 100;
			progressBar.style.transition = "none";
			progressBar.style.width = pct + "%";
		}
	}

	card.addEventListener("mouseenter", pauseTimer);
	card.addEventListener("mouseleave", startTimer);

	// Shake on error
	if (sev === "err") {
		card.addEventListener("animationend", () => {
			inner.style.animation = "pgl-pop-shake .4s ease";
		}, { once: true });
	}

	// Mount
	container.appendChild(card);
	requestAnimationFrame(() => startTimer());

	return card;
}
