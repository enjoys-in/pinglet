let container;
let branding;
let soundPlayer;
let toastContainer;

/**
 * Initialize the Pinglet widget with global configuration.
 */
export function initWidget(globalConfig) {
  // Avoid creating multiple containers
  if (!container) {
    container = document.createElement("div");
    container.id = "pinglet-wrapper";
    container.style.position = "fixed";
    container.style.zIndex = "999999";
    container.style.fontFamily = "sans-serif";

    // Dynamic position (top/bottom)
    if (globalConfig.config?.position?.includes("bottom")) {
      container.style.bottom = "0";
    } else {
      container.style.top = "0";
    }

    container.style.left = "0";
    container.style.right = "0";

    // Inner container
    const widgetArea = document.createElement("div");
    widgetArea.className = "pinglet-container";
    container.appendChild(widgetArea);

    // Branding
    branding = document.createElement("div");
    branding.className = "pinglet-branding";
    branding.innerHTML = globalConfig.branding?.html || "";
    branding.style = "text-align:center;padding:5px;font-size:12px;color:#999";
    container.appendChild(branding);

    document.body.appendChild(container);
  }

  // Sound
  if (globalConfig.sound?.play && globalConfig.sound.src) {
    soundPlayer = new Audio(globalConfig.sound.src);
    soundPlayer.volume = globalConfig.sound.volume ?? 0.5;
  }
}

/**
 * Create or return the toast container at bottom-left.
 */
function createPingletToastContainer(branding) {
  if (toastContainer) return toastContainer;

  const existing = document.getElementById("pinglet-toast-container");
  if (existing) {
    toastContainer = existing;
    return toastContainer;
  }

  // Wrapper container (fixed positioned)
  toastContainer = document.createElement("div");
  toastContainer.id = "pinglet-toast-container";
  toastContainer.style.position = "fixed";
  toastContainer.style.bottom = "20px";
  toastContainer.style.left = "20px";
  toastContainer.style.zIndex = "9999";
  toastContainer.style.display = "flex";
  toastContainer.style.flexDirection = "column";
  toastContainer.style.gap = "8px";
  toastContainer.style.maxWidth = "320px";
  toastContainer.style.pointerEvents = "auto";
  toastContainer.style.transition = "opacity 0.3s ease-in-out";

  // Toast stack container (for notifications)
  const toastStack = document.createElement("div");
  toastStack.className = "pinglet-toast-stack";
  toastStack.style.display = "flex";
  toastStack.style.flexDirection = "column";
  toastStack.style.gap = "12px";
  toastStack.style.pointerEvents = "none";
  toastContainer.appendChild(toastStack);

  if (branding?.show) {
    const brandingElement = document.createElement("div");
    brandingElement.className = "pinglet-branding";
    brandingElement.innerHTML =
      branding?.html ||
      `Notifications by <a href="https://pinglet.enjoys.in" target="_blank" style="color:#4da6ff;text-decoration:none;">Pinglet</a>`;
    brandingElement.style = `
      font-size: 11px;
      color: #999;
      text-align: center;
      pointer-events: auto;
    `;
    toastContainer.appendChild(brandingElement);
  }

  document.body.appendChild(toastContainer);
  return toastContainer;
}

/**
 * Render a toast notification into the container.
 */
export function renderToast(contentEl, globalConfig, el) {
  const config = globalConfig.config;
  const container = createPingletToastContainer(config.branding);

  applyTransition(contentEl, config.transition);
  container.appendChild(contentEl);
  if (config.sound?.play && soundPlayer) {
    soundPlayer.play();
  }

  if (config.auto_dismiss) {
    setTimeout(() => {
      removeToast(contentEl);
      contentEl.remove();
    }, config.duration || 3000);
  }
}

/**
 * Apply transition effects.
 */
function applyTransition(el, type) {
  if (type === "fade") {
    el.style.opacity = "0";
    el.style.transition = "opacity 0.5s ease";
    requestAnimationFrame(() => {
      el.style.opacity = "1";
    });
  } else if (type === "slide") {
    el.style.transform = "translateY(20px)";
    el.style.transition = "transform 0.5s ease";
    requestAnimationFrame(() => {
      el.style.transform = "translateY(0)";
    });
  } else if (type === "zoom") {
    el.style.transform = "scale(0.9)";
    el.style.transition = "transform 0.5s ease";
    requestAnimationFrame(() => {
      el.style.transform = "scale(1)";
    });
  } else {
    el.style.transition = "none"; // Reset if no transition
  }
}
function removeToast(toast) {
  if (!toast) return;
  toast.style.opacity = "0";
  toast.style.transform = "translateX(100%)";
}
