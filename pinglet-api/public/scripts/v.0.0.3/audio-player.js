/**
 * Pinglet SDK v0.0.3 — Audio Player
 * Chat-bubble style audio player with animated waveform bars.
 */

/**
 * Create a styled audio player element with waveform visualization.
 * @param {string} src - Audio file URL
 * @param {boolean} [isMuted=false] - Muted state
 * @param {boolean} [isLooping=false] - Loop audio
 * @param {boolean} [showControls=false] - Show native controls
 * @returns {HTMLDivElement} Audio player bubble element
 */
export function audioPlayerElement(src, isMuted = false, isLooping = false, showControls = false) {
	// Inject keyframes once
	if (!document.getElementById("pinglet-wave-keyframes")) {
		const styleTag = document.createElement("style");
		styleTag.id = "pinglet-wave-keyframes";
		styleTag.textContent = `
@keyframes pinglet-wave {
  0%, 100% { opacity: 0.3; transform: scaleY(0.5); }
  50% { opacity: 1; transform: scaleY(1); }
}`;
		document.head.appendChild(styleTag);
	}

	// Chat bubble container
	const bubble = document.createElement("div");
	Object.assign(bubble.style, {
		maxWidth: "auto",
		padding: "16px",
		borderRadius: "20px 20px 6px 20px",
		background: "#fff",
		boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
		position: "relative",
		fontFamily: "Segoe UI, sans-serif",
	});

	// Message tail
	const tail = document.createElement("div");
	Object.assign(tail.style, {
		position: "absolute",
		bottom: "6px",
		right: "-6px",
		width: "0",
		height: "0",
		borderLeft: "8px solid #ffffff",
		borderBottom: "8px solid transparent",
	});
	bubble.appendChild(tail);

	// Audio element
	const audio = document.createElement("audio");
	audio.src = src;
	audio.autoplay = true;
	audio.muted = isMuted;
	audio.loop = isLooping;
	audio.controls = showControls;
	bubble.appendChild(audio);

	// Controls wrapper
	const controls = document.createElement("div");
	Object.assign(controls.style, {
		display: "flex",
		alignItems: "center",
		gap: "14px",
	});

	// Play/Pause button
	const playBtn = document.createElement("button");
	playBtn.textContent = "▶";
	Object.assign(playBtn.style, {
		background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
		border: "none",
		borderRadius: "50%",
		color: "white",
		width: "44px",
		height: "44px",
		fontSize: "18px",
		cursor: "pointer",
		flexShrink: "0",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		boxShadow: "0 4px 16px rgba(102, 126, 234, 0.4)",
		transition: "transform 0.3s ease",
	});
	controls.appendChild(playBtn);

	// Waveform container
	const waveformContainer = document.createElement("div");
	Object.assign(waveformContainer.style, {
		flex: "1",
		display: "flex",
		flexDirection: "column",
		gap: "8px",
	});

	// Waveform bars
	const waveform = document.createElement("div");
	Object.assign(waveform.style, {
		display: "flex",
		alignItems: "center",
		justifyContent: "space-between",
		height: "32px",
		padding: "0 4px",
	});

	const bars = [];
	for (let i = 0; i < 20; i++) {
		const bar = document.createElement("div");
		Object.assign(bar.style, {
			width: "4px",
			background: "linear-gradient(to top, #667eea, #764ba2)",
			borderRadius: "2px",
			transition: "all 0.3s ease",
			height: `${8 + (i % 5) * 4}px`,
			animation: "pinglet-wave 1.5s infinite ease-in-out",
			animationDelay: `${(i % 5) * 0.15}s`,
			animationPlayState: "paused",
		});
		bars.push(bar);
		waveform.appendChild(bar);
	}
	waveformContainer.appendChild(waveform);

	// Time & label row
	const infoRow = document.createElement("div");
	Object.assign(infoRow.style, {
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
		fontSize: "13px",
		color: "#666",
	});

	const label = document.createElement("div");
	label.textContent = "Voice message";
	Object.assign(label.style, { fontSize: "12px", color: "#888" });

	const timeText = document.createElement("div");
	timeText.textContent = "0:00";
	Object.assign(timeText.style, { fontWeight: "500", color: "#667eea" });

	infoRow.append(label, timeText);
	waveformContainer.appendChild(infoRow);
	controls.appendChild(waveformContainer);
	bubble.appendChild(controls);

	// Time formatting
	function formatTime(seconds) {
		const min = Math.floor(seconds / 60);
		const sec = Math.floor(seconds % 60).toString().padStart(2, "0");
		return `${min}:${sec}`;
	}

	audio.addEventListener("loadedmetadata", () => {
		timeText.textContent = formatTime(audio.duration);
	});

	audio.addEventListener("timeupdate", () => {
		timeText.textContent = formatTime(audio.currentTime);
	});

	// Play/pause toggle
	playBtn.addEventListener("click", () => {
		if (audio.paused) {
			audio.play();
			playBtn.textContent = "⏸";
			for (const bar of bars) bar.style.animationPlayState = "running";
		} else {
			audio.pause();
			playBtn.textContent = "▶";
			for (const bar of bars) bar.style.animationPlayState = "paused";
		}
	});

	audio.addEventListener("ended", () => {
		playBtn.textContent = "▶";
		for (const bar of bars) bar.style.animationPlayState = "paused";
	});

	return bubble;
}
