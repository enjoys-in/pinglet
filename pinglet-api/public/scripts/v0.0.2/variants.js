/** @typedef {import('./types/project.config.js').ProjectConfig} ProjectConfig */
/** @typedef {import('./types/index.js').GlobalConfig} GlobalConfig */
/** @typedef {import('./types/index.js').NotificationDataBody} NotificationDataBody */

import { _btnActions, defaultConfig, defaultStyles } from "./default.js";
import { brandingElement, playSound, toastStack } from "./widget.js";
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
  time = "just now",
  isDark = false
) {
  const row = document.createElement("div");
  row.className = "pinglet-row";
  Object.assign(row.style, {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: isDark ? "#1a1a1a" : "transparent",
    fontFamily: "system-ui, sans-serif",
    fontSize: "10px",
    padding: "6px 10px",
    borderBottom: isDark
      ? "1px solid rgba(255, 255, 255, 0.1)"
      : "1px solid rgba(0, 0, 0, 0.05)",
    color: isDark ? "#f0f0f0" : "#000",
  });

  const left = document.createElement("div");
  left.className = "pinglet-left";
  Object.assign(left.style, {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    flexGrow: "1",
  });

  const icon = document.createElement("span");
  icon.className = "pinglet-icon";
  icon.textContent = "- Pinglet";
  icon.onclick = () => {
    window.open("https://pinglet.enjoys.in", "_blank");
  };
  Object.assign(icon.style, {
    alignItems: "center",
    color: "dodgerblue",
    flexShrink: "0",
    fontWeight: "bold",
    cursor: "pointer",
  });

  const domainText = document.createElement("span");
  domainText.className = "pinglet-domain";
  domainText.textContent = domain;
  domainText.style.color = isDark ? "#bbb" : "#808080";

  const timeText = document.createElement("span");
  timeText.className = "pinglet-time";
  timeText.textContent = `- ${time}`;
  timeText.style.color = isDark ? "#ccc" : "#aaa";

  const closeBtn = document.createElement("button");
  closeBtn.className = "pinglet-close";
  closeBtn.textContent = "✕";
  Object.assign(closeBtn.style, {
    background: "none",
    border: "none",
    fontSize: "12px",
    cursor: "pointer",
    color: isDark ? "#aaa" : "#888",
    padding: "0 4px",
  });

  closeBtn.addEventListener("mouseenter", () => {
    closeBtn.style.color = "#f44";
  });
  closeBtn.addEventListener("mouseleave", () => {
    closeBtn.style.color = isDark ? "#aaa" : "#888";
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
  const themeMode = globalConfig.theme.mode || {};
  const isDark =
    themeMode && window.matchMedia("(prefers-color-scheme: dark)").matches;

  const wrapper = document.createElement("div");
  wrapper.id = "pinglet-variant";
  wrapper.setAttribute(
    "data-key",
    `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  );
  wrapper.className = `pinglet-variant pinglet-${data.variant || "default"}`;
  Object.assign(wrapper.style, {
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    width: "100%",
    maxHeight: "calc(100vh - 40px)",
    borderRadius: "8px",
    overflowY: "auto",
    padding: "4px",
    gap: "4px",
    pointerEvents: "none",
    overflow: "visible",
    flexShrink: "0",
    boxShadow: isDark
      ? "0 2px 8px rgba(0,0,0,0.6)"
      : "0 2px 8px rgba(0,0,0,0.1)",
    backgroundColor: isDark ? "#1e1e1e" : "whitesmoke",
    color: isDark ? "#f0f0f0" : "#000",
  });

  wrapper.appendChild(
    createNotificationHeader(
      globalConfig,
      window.location.hostname,
      "just now",
      isDark
    )
  );

  let mediaEl = null;
  const isInlineMedia = ["icon", "logo"].includes(data.media?.type);

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
      Object.assign(title.style, {
        ...(globalStyle.title || defaultStyles.title),
        color: isDark ? "#ffffff" : "#000000",
      });
      textDiv.appendChild(title);
    }

    if (data.description) {
      const desc = document.createElement("p");
      desc.className = "pinglet-desc";
      desc.innerText = data.description;
      Object.assign(desc.style, {
        ...(globalStyle.description || defaultStyles.description),
        color: isDark ? "#dddddd" : "#333333",
      });
      textDiv.appendChild(desc);
    }

    flexWrapper.appendChild(textDiv);
    wrapper.appendChild(flexWrapper);
  } else {
    if (mediaEl) wrapper.appendChild(mediaEl);

    if (data.title) {
      const title = document.createElement("div");
      title.className = "pinglet-title";
      title.innerText = data.title;
      Object.assign(title.style, {
        ...(globalStyle.title || defaultStyles.title),
        color: isDark ? "#ffffff" : "#000000",
      });
      wrapper.appendChild(title);
    }

    if (data.description) {
      const desc = document.createElement("p");
      desc.className = "pinglet-desc";
      desc.innerText = data.description;
      Object.assign(desc.style, {
        ...(globalStyle.description || defaultStyles.description),
        color: isDark ? "#dddddd" : "#333333",
      });
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
      Object.assign(btnEl.style, {
        cursor: "pointer",
        padding: "6px 10px",
        fontFamily: "Manrope, sans-serif",
        margin: "1px 4px",
        color: isDark ? "#f0f0f0" : "#000",
        backgroundColor: isDark ? "#333" : "#f0f0f0",
        border: "none",
        borderRadius: "4px",
      });

      Object.assign(btnEl.style, i === 0 ? globalStyle.btn1 : globalStyle.btn2);

      if (btn?.onClick) {
        const func = new Function(`return ${btn.onClick}`)();
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

  if (globalConfig.sound?.play) {
    playSound();
  }

  if (
    brandingElement &&
    !wrapper.contains(brandingElement) &&
    !globalConfig.branding?.once
  ) {
    wrapper.appendChild(brandingElement);
  }

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
