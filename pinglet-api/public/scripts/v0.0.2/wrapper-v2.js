const config = {
  autoCloseDelay: 50000,
  brandingText: "Powered by Enjoys",
  brandingPosition: "right",
  defaultClass: "pinglet-wigdet-wrapper",
  spacing: 2,
  maxVisible: 3, // max stacked at once
  side: "right", // default side
};

// Animations in head
const styleSheet = document.createElement("style");
styleSheet.innerHTML = `
@keyframes slideIn {
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes slideOut {
  from { opacity: 1; transform: translateY(0); }
  to { opacity: 0; transform: translateY(40px); }
}`;
document.head.appendChild(styleSheet);

// Containers
function createContainer(id, side) {
  let container = document.getElementById(id);
  if (!container) {
    container = document.createElement("div");
    container.id = id;
    container.style.position = "fixed";
    container.style.zIndex = "9999";
    container.style.display = "flex";
    container.style.flexDirection = "column-reverse";
    container.style.gap = config.spacing + "px";
    container.style.pointerEvents = "none";
    container.style.bottom = "20px";
    container.classList.add(config.defaultClass);

    if (side === "left") container.style.left = "20px";
    else container.style.right = "20px";
    document.body.appendChild(container);
  }
  return container;
}
const containerRight = createContainer("container-right", "right");
const containerLeft = createContainer("container-left", "left");

// Queues per side
const queues = { left: [], right: [] };
const visible = { left: [], right: [] };

// Wrapper creator
export function createWrapper(dynamicElements = [], customConfig = {}) {
  const finalConfig = { ...config, ...customConfig };

  const wrapper = document.createElement("div");
  wrapper.style.position = "relative";
  wrapper.style.width = "300px";
  wrapper.style.padding = "4px";
  wrapper.style.borderRadius = "10px";
  wrapper.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
  wrapper.style.backgroundColor = "#fff";
  wrapper.style.transition = "transform 0.3s ease, opacity 0.3s ease";
  wrapper.style.animation = "slideIn 0.4s forwards";
  wrapper.style.pointerEvents = "all";

  dynamicElements.forEach((el) => wrapper.appendChild(el));

  // Close button
  const closeBtn = document.createElement("button");
  closeBtn.innerText = "×";
  Object.assign(closeBtn.style, {
    position: "absolute",
    top: "-10px",
    right: "-10px",
    width: "25px",
    height: "25px",
    borderRadius: "50%",
    border: "none",
    backgroundColor: "#f00",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
  });
  closeBtn.addEventListener("click", () =>
    removeWrapper(wrapper, finalConfig.side)
  );
  wrapper.appendChild(closeBtn);

  // Branding
  const branding = document.createElement("div");
  branding.innerText = finalConfig.brandingText;
  Object.assign(branding.style, {
    position: "absolute",
    bottom: "5px",
    fontSize: "12px",
    color: "#666",
  });
  branding.style[finalConfig.brandingPosition] = "10px";
  wrapper.appendChild(branding);

  // Auto-close
  let closeTimeout;
  function startCloseTimer() {
    closeTimeout = setTimeout(
      () => removeWrapper(wrapper, finalConfig.side),
      finalConfig.autoCloseDelay
    );
  }
  function stopCloseTimer() {
    clearTimeout(closeTimeout);
  }
  wrapper.addEventListener("mouseenter", stopCloseTimer);
  wrapper.addEventListener("mouseleave", startCloseTimer);
  startCloseTimer();

  // Queue handling
  queues[finalConfig.side].push(wrapper);
  processQueue(finalConfig.side);

  return wrapper;
}

// Process queue for one side
function processQueue(side) {
  const targetContainer = side === "left" ? containerLeft : containerRight;

  while (visible[side].length < config.maxVisible && queues[side].length > 0) {
    const next = queues[side].shift();
    targetContainer.appendChild(next);
    visible[side].push(next);
  }
}

// Remove wrapper
function removeWrapper(wrapper, side) {
  wrapper.style.animation = "slideOut 0.4s forwards";
  wrapper.addEventListener("animationend", () => {
    wrapper.remove();
    const idx = visible[side].indexOf(wrapper);
    if (idx !== -1) visible[side].splice(idx, 1);
    processQueue(side); // show next from queue
  });
}
