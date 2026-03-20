/**
 * Pinglet SDK v0.0.3 — Themed Audio Player
 * Compact audio player that matches the notification card theme.
 * Supports dark/light mode.
 */

const STYLE_ID = "__pinglet_audio_player_css__";

function _ensureMediaStyles() {
	if (document.getElementById(STYLE_ID)) return;
	const s = document.createElement("style");
	s.id = STYLE_ID;
	s.textContent = `
/* ── Audio Player ── */
.pn-audio{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:12px;font-family:inherit;width:100%;box-sizing:border-box}
.pn-audio.pn-a-light{background:rgba(0,0,0,0.03);border:1px solid rgba(0,0,0,0.06)}
.pn-audio.pn-a-dark{background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.08)}

.pn-a-btn{width:36px;height:36px;border-radius:50%;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:transform .15s,background .15s;padding:0}
.pn-a-btn:hover{transform:scale(1.08)}
.pn-a-btn:active{transform:scale(0.95)}
.pn-a-light .pn-a-btn{background:rgba(79,70,229,0.1);color:#4f46e5}
.pn-a-dark .pn-a-btn{background:rgba(129,140,248,0.15);color:#818cf8}
.pn-a-btn svg{width:16px;height:16px;fill:currentColor}

.pn-a-mid{flex:1;display:flex;flex-direction:column;gap:4px;min-width:0}
.pn-a-track{position:relative;height:6px;border-radius:3px;cursor:pointer;overflow:hidden}
.pn-a-light .pn-a-track{background:rgba(0,0,0,0.06)}
.pn-a-dark .pn-a-track{background:rgba(255,255,255,0.08)}
.pn-a-fill{height:100%;border-radius:3px;width:0%;pointer-events:none}
.pn-a-light .pn-a-fill{background:#4f46e5}
.pn-a-dark .pn-a-fill{background:#818cf8}

.pn-a-time{display:flex;justify-content:space-between;font-size:10.5px;font-weight:500;line-height:1}
.pn-a-light .pn-a-time{color:#6b7280}
.pn-a-dark .pn-a-time{color:#8888a8}
`;
	document.head.appendChild(s);
}

const PLAY_ICON = '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>';
const PAUSE_ICON = '<svg viewBox="0 0 24 24"><path d="M6 4h4v16H6zm8 0h4v16h-4z"/></svg>';

/**
 * Themed compact audio player with seekable progress bar.
 * @param {string} src - Audio URL
 * @param {boolean} [isMuted=false]
 * @param {boolean} [isLooping=false]
 * @param {boolean} [showControls=false]
 * @param {boolean} [isDark=false]
 * @returns {HTMLDivElement}
 */
export function audioPlayerElement(src, isMuted = false, isLooping = false, showControls = false, isDark = false) {
	_ensureMediaStyles();

	const player = document.createElement("div");
	player.className = "pn-audio " + (isDark ? "pn-a-dark" : "pn-a-light");

	const audio = document.createElement("audio");
	audio.src = src;
	audio.muted = isMuted;
	audio.loop = isLooping;
	audio.preload = "metadata";
	audio.style.display = "none";
	player.appendChild(audio);

	const btn = document.createElement("button");
	btn.className = "pn-a-btn";
	btn.innerHTML = PLAY_ICON;
	btn.setAttribute("aria-label", "Play audio");
	player.appendChild(btn);

	const mid = document.createElement("div");
	mid.className = "pn-a-mid";

	const track = document.createElement("div");
	track.className = "pn-a-track";
	const fill = document.createElement("div");
	fill.className = "pn-a-fill";
	track.appendChild(fill);
	mid.appendChild(track);

	const timeRow = document.createElement("div");
	timeRow.className = "pn-a-time";
	const tCur = document.createElement("span");
	tCur.textContent = "0:00";
	const tDur = document.createElement("span");
	tDur.textContent = "0:00";
	timeRow.append(tCur, tDur);
	mid.appendChild(timeRow);

	player.appendChild(mid);

	function fmt(s) {
		return Math.floor(s / 60) + ":" + Math.floor(s % 60).toString().padStart(2, "0");
	}

	audio.addEventListener("loadedmetadata", () => { tDur.textContent = fmt(audio.duration); });
	audio.addEventListener("timeupdate", () => {
		if (!audio.duration) return;
		tCur.textContent = fmt(audio.currentTime);
		fill.style.width = (audio.currentTime / audio.duration * 100) + "%";
	});

	track.addEventListener("click", (e) => {
		e.stopPropagation();
		if (!audio.duration) return;
		const rect = track.getBoundingClientRect();
		audio.currentTime = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)) * audio.duration;
	});

	btn.addEventListener("click", (e) => {
		e.stopPropagation();
		if (audio.paused) {
			audio.play();
			btn.innerHTML = PAUSE_ICON;
		} else {
			audio.pause();
			btn.innerHTML = PLAY_ICON;
		}
	});

	audio.addEventListener("ended", () => {
		btn.innerHTML = PLAY_ICON;
		fill.style.width = "0%";
		tCur.textContent = "0:00";
	});

	return player;
}
