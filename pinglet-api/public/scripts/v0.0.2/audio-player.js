export function audioPlayerElement(src, isMuted, isLooping, isControls) {
	const container = document.body;

	// CHAT BUBBLE
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
	// MESSAGE TAIL
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

	// AUDIO ELEMENT
	const audio = document.createElement("audio");
	audio.src = src;
	audio.autoplay = true;
	audio.muted = isMuted;
	audio.loop = isLooping;
	audio.controls = isControls;
	bubble.appendChild(audio);

	// AUDIO CONTROLS WRAPPER
	const controls = document.createElement("div");
	Object.assign(controls.style, {
		display: "flex",
		alignItems: "center",
		gap: "14px",
	});

	// PLAY BUTTON
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

	// WAVEFORM CONTAINER
	const waveformContainer = document.createElement("div");
	Object.assign(waveformContainer.style, {
		flex: "1",
		display: "flex",
		flexDirection: "column",
		gap: "8px",
	});

	// WAVEFORM BARS
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
			animation: "wave 1.5s infinite ease-in-out",
			animationDelay: `${(i % 5) * 0.15}s`,
			animationPlayState: "paused",
		});
		bars.push(bar);
		waveform.appendChild(bar);
	}

	waveformContainer.appendChild(waveform);

	// TIME & LABEL
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
	label.style.fontSize = "12px";
	label.style.color = "#888";

	const timeText = document.createElement("div");
	timeText.textContent = "0:00";
	Object.assign(timeText.style, {
		fontWeight: "500",
		color: "#667eea",
	});

	infoRow.appendChild(label);
	infoRow.appendChild(timeText);
	waveformContainer.appendChild(infoRow);

	controls.appendChild(waveformContainer);
	bubble.appendChild(controls);

	// WAVE KEYFRAMES (inject into head)
	const styleTag = document.createElement("style");
	styleTag.textContent = `
    @keyframes wave {
      0%, 100% { opacity: 0.3; transform: scaleY(0.5); }
      50% { opacity: 1; transform: scaleY(1); }
    }
  `;
	document.head.appendChild(styleTag);

	// JS Logic
	function formatTime(seconds) {
		const min = Math.floor(seconds / 60);
		const sec = Math.floor(seconds % 60)
			.toString()
			.padStart(2, "0");
		return `${min}:${sec}`;
	}

	audio.addEventListener("loadedmetadata", () => {
		timeText.textContent = formatTime(audio.duration);
	});

	audio.addEventListener("timeupdate", () => {
		timeText.textContent = formatTime(audio.currentTime);
	});

	playBtn.addEventListener("click", () => {
		if (audio.paused) {
			audio.play();
			playBtn.textContent = "⏸";
			bars.forEach((bar) => (bar.style.animationPlayState = "running"));
		} else {
			audio.pause();
			playBtn.textContent = "▶";
			bars.forEach((bar) => (bar.style.animationPlayState = "paused"));
		}
	});

	audio.addEventListener("ended", () => {
		playBtn.textContent = "▶";
		bars.forEach((bar) => (bar.style.animationPlayState = "paused"));
		audio.currentTime = 0;
	});

	return bubble;
}
