import { defaultStyles } from "./default.js";

export function createVariant(data, globalStyle) {
  const wrapper = document.createElement("div");
  wrapper.className = `pinglet-variant pinglet-${data.variant || "default"}`;

  if (data.media?.type) {
    const mediaEl = createMediaElement(
      data.media,
      globalStyle.media,
      globalStyle.controls
    );

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
function createMediaElement(media, style, controls) {
  switch (media.type) {
    case "logo": {
      const logo = document.createElement("img");
      logo.src = media.src;
      Object.assign(logo.style, style?.logo || defaultStyles.media.logo);
      return logo;
    }
    case "image": {
      const img = document.createElement("img");
      img.src = media.src;
      Object.assign(img.style, style?.image || defaultStyles.media.image);
      return img;
    }
    case "video": {
      const video = document.createElement("video");
      video.src = media.src;
      video.autoplay =
        controls?.video?.autoplay ||
        defaultStyles.controls.video.autoplay ||
        false;
      video.muted =
        controls?.video?.muted || defaultStyles.controls.video.muted || false;
      video.loop =
        controls?.video?.loop || defaultStyles.controls.video.loop || false;
      video.controls =
        controls?.video?.controls ||
        defaultStyles.controls.video.controls ||
        false;
      video.style = style?.video || defaultStyles.media.video;
      Object.assign(video.style, style?.video || defaultStyles.media.video);

      return video;
    }
    case "audio": {
      const audio = document.createElement("audio");
      audio.src = media.src;
      audio.autoplay =
        controls?.audio?.controls ||
        defaultStyles.controls?.audio.autoplay ||
        false;
      audio.muted =
        controls?.audio?.muted || defaultStyles.controls?.audio.muted || false;
      audio.loop =
        controls?.audio?.loop || defaultStyles.controls?.audio?.loop || false;
      audio.controls =
        controls?.audio?.controls ||
        defaultStyles.controls?.audio?.controls ||
        false;
      Object.assign(audio.style, audio?.video || defaultStyles.media.audio);

      return audio;
    }
    case "icon": {
      const icon = document.createElement("img");
      icon.src = media.src;
      icon.style = style?.icon || defaultStyles.media.icon;
      icon.alt = media.alt || "icon";
      icon.className = "pinglet-icon";
      icon.loading = "lazy";
      return icon;
    }
    default:
      return null;
  }
}
