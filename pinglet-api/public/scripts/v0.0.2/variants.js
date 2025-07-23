/** @typedef {import('./types/project.config.js').ProjectConfig} ProjectConfig */
/** @typedef {import('./types/index.js').GlobalConfig} GlobalConfig */
/** @typedef {import('./types/index.js').NotificationDataBody} NotificationDataBody */

import { _btnActions, defaultConfig, defaultStyles } from "./default.js";
import {
  brandingElement,
  createBrandingElement,
  toastStack,
} from "./widget.js";
/**
 * Create a notification header that displays the domain name, time and a close button.
 * @param {ProjectConfig} [globalConfig] - The global configuration object.
 * @param {string} [domain] - The domain name to display. Defaults to `window.location.hostname`.
 * @param {string} [time] - The time string to display. Defaults to `"just now"`.
 * @returns {HTMLDivElement} The notification header element.
 */
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
    background: "transparent", // solid black background
    fontFamily: "system-ui, sans-serif",
    fontSize: "10px",
    padding: "6px 10px", // added padding for spacing
    borderBottom: "1px solid rgba(255, 255, 255, 0.1)", // visible separator line
    color: "#fff", // default white text
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
    backgroundColor: "#0af", // brighter blue for dark bg
    flexShrink: "0",
  });

  const domainText = document.createElement("span");
  domainText.className = "pinglet-domain";
  domainText.textContent = domain;
  domainText.style.color = "#808080"; // light gray

  const timeText = document.createElement("span");
  timeText.className = "pinglet-time";
  timeText.textContent = `- ${time}`;
  timeText.style.color = "#aaa"; // muted light gray

  const closeBtn = document.createElement("button");
  closeBtn.className = "pinglet-close";
  closeBtn.textContent = "✕";
  Object.assign(closeBtn.style, {
    background: "none",
    border: "none",
    fontSize: "12px",
    cursor: "pointer",
    color: "#aaa",
    padding: "0 4px",
  });

  closeBtn.addEventListener("mouseenter", () => {
    closeBtn.style.color = "#f44"; // red hover
  });
  closeBtn.addEventListener("mouseleave", () => {
    closeBtn.style.color = "#aaa";
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
    closeBtn.parentElement?.parentElement?.remove();
    if (toastStack && toastStack.children.length === 0) {
      brandingElement?.remove();
    }
  };

  return row;
}

/**
 * Create a notification variant.
 * @param {NotificationDataBody} data - Notification data
 * @param {GlobalConfig} config - Global configuration
 * @returns {HTMLElement} - A notification wrapper element
 */
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

  let mediaEl = null;
  const isInlineMedia = ["icon", "logo"].includes(data.media?.type);

  // Create media element
  if (data.media?.type) {
    mediaEl = createMediaElement(
      data.media,
      globalStyle.media,
      globalStyle.controls
    );

    if (isInlineMedia) {
      Object.assign(mediaEl.style, {
        width: "48px",
        height: "48px",
        objectFit: "contain",
        flexShrink: "0",
        marginRight: "6px",
      });
    } else {
      mediaEl.style.marginBottom = "12px";
    }
  }

  // Case: icon/logo (flex row with text)
  if (isInlineMedia) {
    const flexWrapper = document.createElement("div");
    Object.assign(flexWrapper.style, {
      display: "flex",
      flexDirection: "row",
      alignItems: "flex-start",
      gap: "6px",
    });

    const iconDiv = document.createElement("div");
    Object.assign(iconDiv.style, {
      flex: "0 0 auto",
    });
    iconDiv.appendChild(mediaEl);
    flexWrapper.appendChild(iconDiv);

    const textDiv = document.createElement("div");
    Object.assign(textDiv.style, {
      display: "flex",
      flexDirection: "column",
      flex: "1",
    });

    if (data.title) {
      const title = document.createElement("div");
      title.className = "pinglet-title";
      title.innerText = data.title;
      Object.assign(title.style, globalStyle.title || defaultStyles.title);
      textDiv.appendChild(title);
    }

    if (data.description) {
      const desc = document.createElement("p");
      desc.className = "pinglet-desc";
      desc.innerText = data.description;
      Object.assign(
        desc.style,
        globalStyle.description || defaultStyles.description
      );
      textDiv.appendChild(desc);
    }

    flexWrapper.appendChild(textDiv);
    wrapper.appendChild(flexWrapper);
  }

  // Case: image/video/audio (media on top)
  else {
    if (mediaEl) wrapper.appendChild(mediaEl);

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
  }

  if (data.buttons) {
    const btnWrap = document.createElement("div");
    btnWrap.className = "pinglet-buttons";
    btnWrap.style.fontFamily = "Manrope";
    data.buttons.forEach((btn, i) => {
      const btnEl = document.createElement("button");
      btnEl.innerText = btn.text;
      btnEl.className = "pinglet-btn";
      btnEl.style.cursor = "pointer";
      btnEl.style.padding = "6px 10px";
      btnEl.style.fontFamily = "Manrope, sans-serif";
      btnEl.style.margin = "1px 4px";
      Object.assign(btnEl.style, i === 0 ? globalStyle.btn1 : globalStyle.btn2);
      if (btn?.onClick) {
        const func = new Function(`return ${btn.onClick}`)(); // returns the actual arrow function
        if (typeof func === "function") {
          btnEl.addEventListener("click", func);
        }
      } else {
        btnEl.addEventListener("click", _btnActions(btn, wrapper));
      }

      btnWrap.appendChild(btnEl);
    });
    wrapper.appendChild(btnWrap);
  }
  brandingElement && !branding?.once && wrapper.appendChild(brandingElement);
  return wrapper;
}
/**
 * Creates a media element from the given `media` object.
 * @param {MediaData} media - Media object
 * @param {MediaStyleMapStrict} style - Style object
 * @param {MediaControls} controls - Controls object
 * @returns {HTMLElement | null} - Media element
 */
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
      const iconSpan = document.createElement("span");

      if (typeof media.src === "string") {
        const isBase64Image = /^data:image\/(png|jpeg|gif|webp);base64,/.test(
          media.src
        );
        const isSvg = /^<svg[\s\S]*<\/svg>$/.test(media.src.trim());

        if (isBase64Image) {
          iconSpan.style.backgroundImage = `url('${media.src}')`;
          iconSpan.style.backgroundSize = "cover";
          iconSpan.textContent = "";
        } else if (isSvg) {
          iconSpan.innerHTML = media.src;
        } else {
          iconSpan.textContent = media.src; // emoji or text
        }
      }

      iconSpan.className = "pinglet-icon";
      Object.assign(iconSpan.style, {
        width: "40px",
        height: "40px",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundPosition: "center",
        borderRadius: "8px",
        fontSize: "24px",
        overflow: "hidden",
      });
      return iconSpan;
    }
    default:
      return null;
  }
}
