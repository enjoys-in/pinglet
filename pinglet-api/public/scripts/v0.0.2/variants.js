import { defaultConfig, defaultStyles } from "./default.js";
import { brandingElement, toastStack } from "./widget.js";
function createNotificationHeader(
  globalConfig = defaultConfig,
  domain = window.location.hostname,
  time = "just now"
) {
  const row = document.createElement("div");
  row.className = "pinglet-row";
  Object.assign(row.style, {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#fff",
    fontFamily: "system-ui, sans-serif",
    fontSize: "10px",
  });

  const left = document.createElement("div");
  left.className = "pinglet-left";
  Object.assign(left.style, {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    flexGrow: "1",
  });

  const icon = document.createElement("div");
  icon.className = "pinglet-icon";
  Object.assign(icon.style, {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    backgroundColor: "#007bff",
    flexShrink: "0",
  });

  const domainText = document.createElement("span");
  domainText.className = "pinglet-domain";
  domainText.textContent = domain;
  domainText.style.color = "#333";

  const timeText = document.createElement("span");
  timeText.className = "pinglet-time";
  timeText.textContent = `- ${time}`;
  timeText.style.color = "#666";

  const closeBtn = document.createElement("button");
  closeBtn.className = "pinglet-close";
  closeBtn.textContent = "✕";
  Object.assign(closeBtn.style, {
    background: "none",
    border: "none",
    fontSize: "12px",
    cursor: "pointer",
    color: "#888",
  });

  closeBtn.addEventListener("mouseenter", () => {
    closeBtn.style.color = "#e00";
  });
  closeBtn.addEventListener("mouseleave", () => {
    closeBtn.style.color = "#888";
  });

  if (globalConfig?.website) {
    left.appendChild(domainText);
  }
  if (globalConfig?.time) {
    left.appendChild(timeText);
  }
  if (globalConfig?.favicon) {
    left.appendChild(icon);
  }
  row.appendChild(left);
  if (globalConfig?.dismissible) {
    row.appendChild(closeBtn);
  }
  closeBtn.onclick = () => {
    closeBtn.parentElement.parentElement.remove();
    if (toastStack && toastStack.children.length === 0) {
      brandingElement?.remove();
    }
  };
  return row;
}

export function createVariant(data, config) {
  const globalStyle = config.style;
  const globalConfig = config.config;

  const wrapper = document.createElement("div");
  wrapper.className = `pinglet-variant pinglet-${data.variant || "default"}`;
  wrapper.style.display = "flex";
  wrapper.style.flexDirection = "column";
  wrapper.style.alignItems = "stretch";
  wrapper.style.width = "100%";
  wrapper.style.maxHeight = "calc(100vh - 40px)";
  wrapper.style.borderRadius = "8px";
  wrapper.style.overflowY = "auto";
  wrapper.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.1)";
  wrapper.style.padding = "4px";

  wrapper.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
  wrapper.style.gap = "4px";
  wrapper.style.pointerEvents = "none";
  wrapper.style.overflow = "visible";
  wrapper.style.flexShrink = "0";
  wrapper.appendChild(createNotificationHeader(globalConfig));

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
    Object.assign(title.style, globalStyle.title || defaultStyles.title);
    wrapper.appendChild(title);
  }

  if (data.description) {
    const desc = document.createElement("p");
    desc.className = "pinglet-desc";
    desc.innerText = data.description;
    Object.assign(
      desc.style,
      globalStyle.description || defaultStyles.description
    );
    wrapper.appendChild(desc);
  }

  if (data.buttons) {
    const btnWrap = document.createElement("div");
    btnWrap.className = "pinglet-buttons";
    btnWrap.style.fontFamily = "Manrope";
    data.buttons.forEach((btn, i) => {
      const b = document.createElement("button");
      b.innerText = btn.text;
      b.className = "pinglet-btn";
      b.style.cursor = "pointer";
      b.style.padding = "6px 10px";
      b.style.fontFamily = "Manrope, sans-serif";
      b.style.margin = "1px 4px";
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
