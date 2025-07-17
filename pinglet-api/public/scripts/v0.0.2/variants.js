// variant.js

export function createVariant(data, globalStyle) {
	const wrapper = document.createElement("div");
	wrapper.className = `pinglet-variant pinglet-${data.variant || "default"}`;

	if (data.media?.type) {
		const mediaEl = createMediaElement(data.media);
		if (mediaEl) wrapper.appendChild(mediaEl);
	}

	if (data.title) {
		const title = document.createElement("div");
		title.className = "pinglet-title";
		title.innerText = data.title;
		Object.assign(title.style, globalStyle.heading);
		wrapper.appendChild(title);
	}

	if (data.description) {
		const desc = document.createElement("div");
		desc.className = "pinglet-desc";
		desc.innerText = data.description;
		Object.assign(desc.style, globalStyle.text);
		wrapper.appendChild(desc);
	}

	if (data.buttons) {
		const btnWrap = document.createElement("div");
		btnWrap.className = "pinglet-buttons";
		data.buttons.forEach((btn, i) => {
			const b = document.createElement("button");
			b.innerText = btn.text;
			Object.assign(b.style, i === 0 ? globalStyle.btn1 : globalStyle.btn2);
			b.onclick = new Function(btn.onClick); // Be cautious with `new Function`
			btnWrap.appendChild(b);
		});
		wrapper.appendChild(btnWrap);
	}

	return wrapper;
}

function createMediaElement(media) {
	switch (media.type) {
		case "image": {
			const img = document.createElement("img");
			img.src = media.src;
			img.style.width = "100%";
			return img;
		}
		case "video": {
			const video = document.createElement("video");
			video.src = media.src;
			video.autoplay = true;
			video.muted = true;
			video.loop = true;
			video.style.width = "100%";
			return video;
		}
		case "audio": {
			const audio = document.createElement("audio");
			audio.src = media.src;
			audio.autoplay = true;
			return audio;
		}
		case "icon": {
			const icon = document.createElement("img");
			icon.src = media.src;
			icon.style.width = "30px";
			icon.style.height = "30px";
			return icon;
		}
		default:
			return null;
	}
}
