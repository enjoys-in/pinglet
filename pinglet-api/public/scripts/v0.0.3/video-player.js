/**
 * Pinglet SDK v0.0.3 — Themed Video Player
 * Full custom-controls video player: play/pause, seekable progress, time,
 * volume/mute toggle, fullscreen. Autoplay muted. Dark/light theme.
 *
 * Follows single-responsibility: only video rendering & interaction.
 * html-notification.js owns dismiss/timer logic.
 */

const STYLE_ID = "__pinglet_video_player_css__";

function _ensureVideoStyles() {
	if (document.getElementById(STYLE_ID)) return;
	const s = document.createElement("style");
	s.id = STYLE_ID;
	s.textContent = `
/* ─── Container ─── */
.pnv{position:relative;border-radius:10px;overflow:hidden;width:100%;font-family:inherit;user-select:none;-webkit-user-select:none}

/* ─── Video element ─── */
.pnv video{width:100%;display:block;max-height:220px;object-fit:cover;border-radius:10px}
.pnv.pnv-dark video{border:1px solid rgba(255,255,255,0.06);box-sizing:border-box}

/* ─── Controls bar (bottom overlay) ─── */
.pnv-controls{
  position:absolute;bottom:0;left:0;right:0;
  display:flex;align-items:center;gap:6px;
  padding:6px 10px;
  background:linear-gradient(transparent,rgba(0,0,0,0.55));
  opacity:0;transition:opacity .25s;
  border-radius:0 0 10px 10px;
  pointer-events:auto;
}
.pnv:hover .pnv-controls,.pnv.pnv-playing .pnv-controls{opacity:1}

/* ─── Shared icon button ─── */
.pnv-btn{
  width:28px;height:28px;border:none;border-radius:50%;cursor:pointer;
  display:flex;align-items:center;justify-content:center;flex-shrink:0;
  padding:0;transition:transform .12s,background .12s;
  background:rgba(255,255,255,0.15);color:#fff;
  backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);
}
.pnv-btn:hover{transform:scale(1.08);background:rgba(255,255,255,0.25)}
.pnv-btn:active{transform:scale(0.94)}
.pnv-btn svg{width:14px;height:14px;fill:currentColor}

/* ─── Seek / progress track ─── */
.pnv-track{flex:1;position:relative;height:4px;border-radius:2px;cursor:pointer;background:rgba(255,255,255,0.2);overflow:visible}
.pnv-fill{height:100%;border-radius:2px;width:0%;pointer-events:none;background:rgba(255,255,255,0.85);position:relative}
.pnv-fill::after{
  content:'';position:absolute;right:-5px;top:50%;transform:translateY(-50%);
  width:10px;height:10px;border-radius:50%;background:#fff;
  box-shadow:0 0 4px rgba(0,0,0,0.3);
  opacity:0;transition:opacity .15s;
}
.pnv:hover .pnv-fill::after{opacity:1}

/* ─── Time label ─── */
.pnv-time{font-size:10px;color:rgba(255,255,255,0.85);white-space:nowrap;min-width:52px;text-align:center;font-variant-numeric:tabular-nums;pointer-events:none}

/* ─── Big center play overlay (paused state) ─── */
.pnv-overlay{
  position:absolute;inset:0;display:flex;align-items:center;justify-content:center;
  background:rgba(0,0,0,0.25);transition:opacity .25s;cursor:pointer;border-radius:10px;
}
.pnv-overlay.pnv-hide{opacity:0;pointer-events:none}
.pnv-big-play{
  width:50px;height:50px;border-radius:50%;border:none;cursor:pointer;
  display:flex;align-items:center;justify-content:center;
  backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);
  transition:transform .15s;padding:0;
}
.pnv-big-play:hover{transform:scale(1.1)}
.pnv-big-play svg{width:22px;height:22px;fill:currentColor}

.pnv-big-play.pnv-bp-light{background:rgba(255,255,255,0.75);color:#1a1a2e}
.pnv-big-play.pnv-bp-dark{background:rgba(0,0,0,0.5);color:#f0f0f0}

/* ─── Volume slider ─── */
.pnv-vol-wrap{display:flex;align-items:center;gap:4px;position:relative}
.pnv-vol-slider{
  width:0;overflow:hidden;transition:width .2s;height:4px;border-radius:2px;
  cursor:pointer;appearance:none;-webkit-appearance:none;background:rgba(255,255,255,0.2);
}
.pnv-vol-wrap:hover .pnv-vol-slider{width:50px}
.pnv-vol-slider::-webkit-slider-thumb{-webkit-appearance:none;width:10px;height:10px;border-radius:50%;background:#fff;cursor:pointer;border:none}
.pnv-vol-slider::-moz-range-thumb{width:10px;height:10px;border-radius:50%;background:#fff;cursor:pointer;border:none}
.pnv-vol-slider::-webkit-slider-runnable-track{height:4px;border-radius:2px;background:rgba(255,255,255,0.2)}
.pnv-vol-slider::-moz-range-track{height:4px;border-radius:2px;background:rgba(255,255,255,0.2)}
`;
	document.head.appendChild(s);
}

// ─── SVG Icons ───

const ICO_PLAY = '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>';
const ICO_PAUSE = '<svg viewBox="0 0 24 24"><path d="M6 4h4v16H6zm8 0h4v16h-4z"/></svg>';
const ICO_MUTED = '<svg viewBox="0 0 24 24"><path d="M16.5 12A4.5 4.5 0 0 0 14 8.18v1.7l2.4 2.4c.06-.36.1-.74.1-1.13v-.15zM19 12c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.7 8.7 0 0 0 21 12c0-4.28-2.99-7.86-7-8.77v2.06C17.01 6.25 19 8.9 19 12zM4.27 3 3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06a8.99 8.99 0 0 0 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4 9.91 6.09 12 8.18V4z"/></svg>';
const ICO_VOL = '<svg viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 8.18v7.64c1.5-.74 2.5-2.24 2.5-3.82zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>';
const ICO_FS = '<svg viewBox="0 0 24 24"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>';
const ICO_FS_EXIT = '<svg viewBox="0 0 24 24"><path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/></svg>';
const ICO_REPLAY = '<svg viewBox="0 0 24 24"><path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/></svg>';

// ─── Helpers ───

function _fmt(s) {
	if (!s || !isFinite(s)) return "0:00";
	const m = Math.floor(s / 60);
	const sec = Math.floor(s % 60).toString().padStart(2, "0");
	return m + ":" + sec;
}

/**
 * Create a themed video player with full custom controls.
 *
 * @param {string}  src       Video URL
 * @param {boolean} [isMuted=true]  Start muted (required for autoplay)
 * @param {boolean} [isDark=false]  Dark theme variant
 * @param {(durationMs: number) => void} [onDurationReady]  Called when metadata loads with duration in ms
 * @returns {{ element: HTMLDivElement, getDuration: () => number }}
 *   element    — DOM node to mount
 *   getDuration — Returns video duration in ms once metadata loads (0 until then)
 */
export function videoPlayerElement(src, isMuted = true, isDark = false, onDurationReady = null) {
	_ensureVideoStyles();

	let _durationMs = 0;

	// ─── Container ───
	const wrap = document.createElement("div");
	wrap.className = "pnv" + (isDark ? " pnv-dark" : "");

	// ─── Video ───
	const video = document.createElement("video");
	video.src = src;
	video.muted = isMuted;
	video.playsInline = true;
	video.preload = "metadata";
	wrap.appendChild(video);

	// ─── Big center play overlay ───
	const overlay = document.createElement("div");
	overlay.className = "pnv-overlay";
	const bigPlay = document.createElement("button");
	bigPlay.className = "pnv-big-play " + (isDark ? "pnv-bp-dark" : "pnv-bp-light");
	bigPlay.innerHTML = ICO_PLAY;
	bigPlay.setAttribute("aria-label", "Play video");
	overlay.appendChild(bigPlay);
	wrap.appendChild(overlay);

	// ─── Controls bar ───
	const controls = document.createElement("div");
	controls.className = "pnv-controls";

	// Play/Pause btn
	const playBtn = document.createElement("button");
	playBtn.className = "pnv-btn";
	playBtn.innerHTML = ICO_PLAY;
	playBtn.setAttribute("aria-label", "Play");
	controls.appendChild(playBtn);

	// Seek track
	const track = document.createElement("div");
	track.className = "pnv-track";
	const fill = document.createElement("div");
	fill.className = "pnv-fill";
	track.appendChild(fill);
	controls.appendChild(track);

	// Time label
	const timeEl = document.createElement("span");
	timeEl.className = "pnv-time";
	timeEl.textContent = "0:00 / 0:00";
	controls.appendChild(timeEl);

	// Volume wrap
	const volWrap = document.createElement("div");
	volWrap.className = "pnv-vol-wrap";
	const volBtn = document.createElement("button");
	volBtn.className = "pnv-btn";
	volBtn.innerHTML = isMuted ? ICO_MUTED : ICO_VOL;
	volBtn.setAttribute("aria-label", "Toggle mute");
	const volSlider = document.createElement("input");
	volSlider.type = "range";
	volSlider.min = "0";
	volSlider.max = "1";
	volSlider.step = "0.05";
	volSlider.value = isMuted ? "0" : "0.7";
	volSlider.className = "pnv-vol-slider";
	volWrap.append(volBtn, volSlider);
	controls.appendChild(volWrap);

	// Fullscreen btn
	const fsBtn = document.createElement("button");
	fsBtn.className = "pnv-btn";
	fsBtn.innerHTML = ICO_FS;
	fsBtn.setAttribute("aria-label", "Fullscreen");
	controls.appendChild(fsBtn);

	wrap.appendChild(controls);

	// ─── State ───
	let _seeking = false;
	let _prevVol = 0.7;
	let _ended = false;

	// ─── Video events ───

	video.addEventListener("loadedmetadata", () => {
		_durationMs = Math.round(video.duration * 1000);
		timeEl.textContent = "0:00 / " + _fmt(video.duration);

		// Notify the notification card so it can sync its timer
		if (typeof onDurationReady === "function") onDurationReady(_durationMs);

		// Autoplay muted
		video.play().then(() => {
			wrap.classList.add("pnv-playing");
			overlay.classList.add("pnv-hide");
			playBtn.innerHTML = ICO_PAUSE;
		}).catch(() => {
			// Autoplay blocked — stay paused with overlay
		});
	});

	video.addEventListener("timeupdate", () => {
		if (_seeking || !video.duration) return;
		const pct = (video.currentTime / video.duration) * 100;
		fill.style.width = pct + "%";
		timeEl.textContent = _fmt(video.currentTime) + " / " + _fmt(video.duration);
	});

	video.addEventListener("play", () => {
		_ended = false;
		wrap.classList.add("pnv-playing");
		overlay.classList.add("pnv-hide");
		playBtn.innerHTML = ICO_PAUSE;
	});

	video.addEventListener("pause", () => {
		if (_ended) return;
		wrap.classList.remove("pnv-playing");
		overlay.classList.remove("pnv-hide");
		bigPlay.innerHTML = ICO_PLAY;
		playBtn.innerHTML = ICO_PLAY;
	});

	video.addEventListener("ended", () => {
		_ended = true;
		wrap.classList.remove("pnv-playing");
		overlay.classList.remove("pnv-hide");
		bigPlay.innerHTML = ICO_REPLAY;
		playBtn.innerHTML = ICO_REPLAY;
		fill.style.width = "100%";
	});

	// ─── Play / Pause toggling ───

	function togglePlay(e) {
		e.stopPropagation();
		if (_ended) {
			// Replay
			_ended = false;
			video.currentTime = 0;
			video.play();
			return;
		}
		if (video.paused) {
			video.play();
		} else {
			video.pause();
		}
	}

	bigPlay.addEventListener("click", togglePlay);
	playBtn.addEventListener("click", togglePlay);

	// Click on video itself also toggles (when controls visible)
	video.addEventListener("click", (e) => {
		togglePlay(e);
	});

	// ─── Seeking ───

	track.addEventListener("mousedown", (e) => {
		e.stopPropagation();
		_seeking = true;
		_seekTo(e);
		const onMove = (ev) => _seekTo(ev);
		const onUp = () => {
			_seeking = false;
			document.removeEventListener("mousemove", onMove);
			document.removeEventListener("mouseup", onUp);
		};
		document.addEventListener("mousemove", onMove);
		document.addEventListener("mouseup", onUp);
	});

	function _seekTo(e) {
		if (!video.duration) return;
		const rect = track.getBoundingClientRect();
		const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
		video.currentTime = ratio * video.duration;
		fill.style.width = (ratio * 100) + "%";
		timeEl.textContent = _fmt(video.currentTime) + " / " + _fmt(video.duration);
	}

	// ─── Volume ───

	volBtn.addEventListener("click", (e) => {
		e.stopPropagation();
		if (video.muted || video.volume === 0) {
			video.muted = false;
			video.volume = _prevVol || 0.7;
			volSlider.value = String(video.volume);
			volBtn.innerHTML = ICO_VOL;
		} else {
			_prevVol = video.volume;
			video.muted = true;
			volSlider.value = "0";
			volBtn.innerHTML = ICO_MUTED;
		}
	});

	volSlider.addEventListener("input", (e) => {
		e.stopPropagation();
		const v = parseFloat(volSlider.value);
		video.volume = v;
		video.muted = v === 0;
		volBtn.innerHTML = v === 0 ? ICO_MUTED : ICO_VOL;
		if (v > 0) _prevVol = v;
	});

	volSlider.addEventListener("click", (e) => e.stopPropagation());

	// ─── Fullscreen ───

	fsBtn.addEventListener("click", (e) => {
		e.stopPropagation();
		if (document.fullscreenElement === wrap) {
			document.exitFullscreen();
		} else {
			wrap.requestFullscreen?.() || wrap.webkitRequestFullscreen?.();
		}
	});

	document.addEventListener("fullscreenchange", () => {
		fsBtn.innerHTML = document.fullscreenElement === wrap ? ICO_FS_EXIT : ICO_FS;
	});

	return {
		element: wrap,
		getDuration: () => _durationMs,
	};
}
