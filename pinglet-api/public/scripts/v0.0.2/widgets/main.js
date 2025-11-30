const scriptEl = Array.from(document.scripts).find((s) =>
  s.src.includes("/widgets/main.js")
);
const currentScript = scriptEl || document.currentScript;
const widgetId = currentScript?.dataset.widgetId;
const checksum = currentScript?.dataset.checksum;
import Wrapper from "../wrapper-v1.js";
import { createWrapper } from "../wrapper-v2.js";
const displayError = (msg) => {
  return function () {
    const errorBox = document.createElement("div");
    errorBox.id = "pinglet-error-box";
    errorBox.className = "pinglet-error-box";
    errorBox.innerText = msg;
    Object.assign(errorBox.style, {
      position: "fixed",
      bottom: "20px",
      right: "20px",
      backgroundColor: "#fee2e2", // light red
      color: "#991b1b", // dark red text
      padding: "12px 16px",
      border: "1px solid #fecaca",
      borderRadius: "8px",
      fontSize: "14px",
      fontWeight: "500",
      boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
      zIndex: 9999,
      fontFamily: "Arial, sans-serif",
      maxWidth: "250px",
    });

    document.body.appendChild(errorBox);

    // Optional: auto-dismiss after 5 seconds
    setTimeout(() => {
      errorBox.remove();
    }, 5000);
  };
};

((global) => {
  const version = "1.0.0";
  if (!widgetId || !checksum) {
    displayError("Widget ID or checksum is missing in the script tag.")();
    return;
  }
  function injectFont() {
    // Inject Google Font
    const fontLink = document.createElement("link");
    fontLink.rel = "stylesheet";
    fontLink.href =
      "https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap";
    document.head.appendChild(fontLink);

    // Inject font override for all .pinglet-* classes
    const fontStyle = document.createElement("style");
    fontStyle.innerHTML = `
    [class^="pinglet-"],
    [class*=" pinglet-"] {
      font-family: 'Inter', sans-serif !important;
    }
  `;
    document.head.appendChild(fontStyle);
  }

  async function initWidget() {
    console.log(
      "%cPingletWidget initialized successfully.",
      "color: #1e90ff; font-weight: bold;",
      version
    );
    const response = await fetch(
      `http://localhost:8888/api/v1/load-widget-v2/${widgetId}`,
      {
        headers: {
          "X-Widget-ID": widgetId,
          "X-Timestamp": Date.now(),
          "X-Pinglet-Widget-Checksum": checksum,
          "X-Pinglet-Widget-Version": version,
        },
        credentials: "omit",
      }
    );
    const parsedResponse = await response.text();
    const run = new Function(parsedResponse + "\nreturn element;");
    const element = run();
    if (Array.isArray(element)) {
      createWrapper(element, { side: "right" });
    } else {
      createWrapper([element], { side: "right" });
    }
  }
  injectFont();
  initWidget();
})(window);

export { Wrapper };
