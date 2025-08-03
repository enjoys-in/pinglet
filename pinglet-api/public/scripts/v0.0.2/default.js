/** @typedef {import('./types/project.config.js').ProjectConfig} ProjectConfig */
/** @typedef {import('./types/buttons.js').ButtonsData} ButtonsData  */

/**
 * Fire a custom event with the given eventname and detail
 * @param {string} [eventname="pinglet:notificationClosed"] - The name of the event
 * @param {detail:{contentEl: HTMLElement, reason: "user-dismiss"}} [detail] - The detail of the event
 * @returns {boolean} whether the default action was prevented or not
 */
export function fireCustomEvent(
  eventname = "pinglet:notificationClosed",
  detail
) {
  return window.dispatchEvent(
    new CustomEvent(eventname, {
      detail,
    })
  );
}
/**
 * @function
 * @param {ButtonsData} btn
 * @param {HTMLButtonElement} ele - The toast element to be manipulated
 * @returns {Function} - The function that is triggered when a notification button is clicked
 */
export function _btnActions(btn, ele) {
  switch (btn.action) {
    case "redirect":
    case "open":
      return window.open(btn.src, "_blank");
    case "link":
      return window.open(btn.src);
    case "alert":
      return alert(btn.src);
    case "reload":
      return window.location.reload();
    case "event":
      return window.addEventListener(btn.src, () => {});
    case "close":
    case "dismiss":
      return window.dispatchEvent(
        new CustomEvent("pinglet:notificationClosed", {
          detail: {
            contentEl: ele,
            reason: "user-dismiss",
          },
        })
      );
  }
  return window.open("https://pinglet.enjoys.in/docs", "_blank");
}

/**
 * @typedef {Object} ShowPopup
 * @param {string} title
 * @param {string} [description]
 * @param {Array<ButtonsData>} [buttons]
 * @param {string} [icon="⚠️"]
 * @param {{duration: number, auto_dismiss: boolean}} [options]
 * @returns {HTMLElement}
 */
export function _showPopup(
  title,
  description,
  buttons = [
    {
      text: "See Docs",
      onClick: () => window.open("https://pinglet.enjoys.in/docs", "_blank"),
    },
  ],
  icon = "⚠️",
  options = {
    duration: 5000,
    auto_dismiss: true,
  }
) {
  const containerId = "toastContainer";
  let container = document.getElementById(containerId);

  if (!container) {
    container = document.createElement("div");
    container.id = containerId;

    Object.assign(container.style, {
      position: "fixed",
      bottom: "24px",
      right: "24px",
      zIndex: "9999",
      display: "flex",
      flexDirection: "column",
      gap: "4px",
      alignItems: "flex-end",
      fontFamily: "Manrope, sans-serif",
    });
    document.body.appendChild(container);
  }

  // Create toast element
  const toast = document.createElement("div");
  Object.assign(toast.style, {
    background: "#1f1f1f",
    color: "#fff",
    padding: "16px 20px",
    borderRadius: "12px",
    boxShadow: "0 6px 18px rgba(0, 0, 0, 0.25)",
    fontFamily: "'Inter', sans-serif",
    minWidth: "260px",
    maxWidth: "340px",
    opacity: "0",
    transform: "translateX(100%)",
    transition: "opacity 0.3s ease, transform 0.3s ease",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    fontFamily: "Manrope, sans-serif",
  });

  // Icon + Title
  const iconTitleRow = document.createElement("div");
  Object.assign(iconTitleRow.style, {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "16px",
    fontWeight: "600",
    fontFamily: "Manrope, sans-serif",
  });

  const iconEl = document.createElement("div");
  iconEl.textContent = icon;

  const titleEl = document.createElement("div");
  titleEl.textContent = title;

  iconTitleRow.appendChild(iconEl);
  iconTitleRow.appendChild(titleEl);
  toast.appendChild(iconTitleRow);

  // Description
  if (description) {
    const descEl = document.createElement("div");
    descEl.textContent = description;
    Object.assign(descEl.style, {
      fontSize: "13.5px",
      fontWeight: "400",
      color: "#ddd",
      lineHeight: "1.5",
    });
    toast.appendChild(descEl);
  }

  // Buttons
  if (Array.isArray(buttons) && buttons.length) {
    const btnRow = document.createElement("div");
    Object.assign(btnRow.style, {
      marginTop: "8px",
      display: "flex",
      gap: "10px",
      justifyContent: "flex-start",
    });

    for (const btn of buttons) {
      const btnEl = document.createElement("button");
      btnEl.textContent = btn.text || "Click Here";
      Object.assign(btnEl.style, {
        padding: "8px 14px",
        background: "#333",
        color: "#fff",
        border: "1px solid #444",
        borderRadius: "6px",
        fontSize: "13px",
        cursor: "pointer",
        transition: "background 0.3s",
        fontFamily: "Manrope, sans-serif",
      });

      btnEl.onmouseover = () => (btnEl.style.background = "#444");
      btnEl.onmouseout = () => (btnEl.style.background = "#333");
      if (btn?.onClick) {
        const func = new Function(`return ${btn.onClick}`)(); // returns the actual arrow function
        if (typeof func === "function") {
          btnEl.addEventListener("click", func);
        }
      } else {
        btnEl.addEventListener("click", _btnActions(btn, btnEl));
      }

      btnRow.appendChild(btnEl);
    }

    toast.appendChild(btnRow);
  }

  const footer = document.createElement("div");
  footer.innerHTML = `Notifications by <a href="https://pinglet.enjoys.in" target="_blank" style="color:#4da6ff;text-decoration:none;">Pinglet</a> - Enjoys`;
  Object.assign(footer.style, {
    fontSize: "11px",
    color: "#999",
    marginTop: "4px",
    textAlign: "right",
    fontFamily: "Manrope, sans-serif",
  });

  container.appendChild(toast);
  container.appendChild(footer);

  // Animate in
  requestAnimationFrame(() => {
    toast.style.opacity = "1";
    toast.style.transform = "translateX(0)";
  });

  // Auto-remove after 5s
  if (!options.auto_dismiss) {
    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(100%)";
      setTimeout(() => {
        toast.remove();
        footer.remove(); // Also remove footer when toast is gone
      }, 500);
    }, options.duration || 5000);
  }
  return container;
}
/**
 * Injects Manrope font via Google Fonts and applies it to all elements with
 * classes starting with "pinglet-".
 *
 * @returns {void}
 */
export function injectFont() {
  // Inject Google Font
  const fontLink = document.createElement("link");
  fontLink.rel = "stylesheet";
  fontLink.href =
    "https://fonts.googleapis.com/css2?family=Manrope:wght@200..800&display=swap";
  document.head.appendChild(fontLink);

  // Inject font override for all .pinglet-* classes
  const fontStyle = document.createElement("style");
  fontStyle.innerHTML = `
    [class^="pinglet-"],
    [class*=" pinglet-"] {
      font-family: 'Manrope', sans-serif !important;
      font-weight: 400 !important;
    }
  `;
  document.head.appendChild(fontStyle);
}

/** @type {TemplateStyleConfig} */
export const defaultStyles = {
  duration: 3000, // 3 seconds
  btn1: {
    color: "#ffffff",
    backgroundColor: "#007bff", // primary blue
    padding: "6px 10px",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: "600",
    border: "none",
    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
  },

  btn2: {
    color: "#333333",
    backgroundColor: "#f0f0f0", // neutral
    padding: "6px 10px",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: "600",
    border: "1px solid #ccc",
  },

  title: {
    color: "#111111",
    fontSize: "14px",
    fontWeight: "500",
    lineHeight: "1.4",
    margin: "0 0 0 0",
    textAlign: "left",
  },

  description: {
    color: "#444444",
    fontSize: "13px",
    fontWeight: "400",
    lineHeight: "1.5",
    margin: "0 0 10px 0",
    textAlign: "left",
  },
  controls: {
    video: {
      autoplay: false,
      muted: false,
      loop: false,
      controls: false,
    },
    audio: {
      autoplay: false,
      muted: false,
      loop: false,
      controls: false,
    },
  },
  media: {
    image: {
      width: "100%",
      height: "200px",
      borderRadius: "6px",
      objectFit: "cover",
      margin: "0 0 8px 0",
    },
    icon: {
      width: "24px",
      height: "24px",
      margin: "0 8px 0 0",
      objectFit: "contain",
    },
    logo: {
      width: "50px",
      height: "50px",
      margin: "0 8px 0 0",
      objectFit: "contain",
    },
    video: {
      width: "100%",
      height: "140px",
      borderRadius: "6px",
      objectFit: "cover",
      margin: "0 0 10px 0",
    },
    iframe: {
      width: "100%",
      height: "140px",
      borderRadius: "6px",
      objectFit: "cover",
      margin: "0 0 10px 0",
    },
    audio: {
      width: "100%",
      margin: "8px 0",
    },
  },
};

/** @type {ProjectConfig} */
export const defaultConfig = {
  position: "bottom-left",
  transition: "fade", // or "slide", "zoom"
  branding: {
    show: true,
    once: true,
    html: `Notifications by <a href="https://pinglet.enjoys.in" style="color:#4da6ff;text-decoration:none;" target="_blank">Pinglet</a> - Enjoys`,
  },
  sound: {
    play: false,
    src: "https://pinglet.enjoys.in/api/v1/pinglet-sound.mp3?v=1&ext=mp3",
    volume: 0.6,
  },
  duration: 2000,
  maxVisible: 3, // 🆕 Max number of visible toasts
  stacking: true, // 🆕 Whether to stack new toasts vertically
  auto_dismiss: true, // 🆕 Automatically dismiss after duration
  dismissible: true, // 🆕 Show close "X" button
  website: "https://pinglet.enjoys.in",
  time: true, // 🆕 Show time of notification
  favicon: true, // 🆕 Show favicon of the website
  pauseOnHover: true,
  theme: {
    mode: "light", // 🆕 "light" | "dark" | "auto"
    customClass: "", // 🆕 Custom class for advanced styling
    rounded: true, // 🆕 Rounded corners
    shadow: true, // 🆕 Enable/disable shadow
    border: false, // 🆕 Border around toast
  },
  iconDefaults: {
    show: true, // 🆕 Show icon by default
    size: 20,
    position: "left", // "left" | "right" | "top"
  },
  progressBar: {
    show: true, // 🆕 Show progress bar timer
    color: "#4da6ff", // Optional customization
    height: 3,
  },
};
