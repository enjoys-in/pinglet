import { _showPopup, defaultConfig, defaultStyles } from "./default.js";
 
import { createVariant } from "./variants.js";
import { initWidget, renderToast } from "./widget.js";
const scriptEl = Array.from(document.scripts).find(
  (s) => s.src.includes("main.js") && s.dataset.endpoint
);
const currentScript = scriptEl || document.currentScript;

const endpoint = currentScript?.dataset.endpoint;
const configuredDomain = currentScript?.dataset.configuredDomain;
const projectIds = currentScript?.dataset.projectIds?.split(",") || [];
const pingletId = currentScript?.dataset.pingletId;

(async (global) => {
  if (global.PingletWidget) {
    console.warn("PingletWidget is already initialized.");
    return;
  }

  const PingletWidget = {
    async init({ endpoint, configuredDomain, projectIds, pingletId }) {
      const response = await fetch(
        `${endpoint}/load/projects?projectIds=${projectIds.join(
          ","
        )}&domain=${configuredDomain}`
      );

      const data = await response.json();

      if (!data || !data.success) {
        _showPopup(
          "Configuration Error",
          `Failed to load configuration for PingletWidget. ${
            data.message || "Unknown error"
          }`,
          [
            {
              text: "Retry",
              onClick: () => window.location.reload(),
            },
            {
              text: "See Docs",
              onClick: () =>
                window.open("https://pinglet.enjoys.in/docs", "_blank"),
            },
          ],
          "❌"
        );
        return console.error("Failed to load configuration for PingletWidget.");
      }

      const globalConfig = {
        el:
          data.result.template?.compiled_text.length > 0
            ? data.result.template?.compiled_text
            : "default",
        style: data.result.template?.config || defaultStyles,
        config: data.result.config || defaultConfig,
      };

      initWidget(globalConfig);
      const socket = new EventSource(
        `${endpoint}/subscribe?projectId=${projectIds}&pingletId=${pingletId}`
      );
      socket.onmessage = (e) => {
        const data = JSON.parse(e.data);
        // data has variant also
        const variantEl = createVariant(
          data,
          globalConfig.style,
          globalConfig.el
        );
		 
        renderToast(variantEl, globalConfig);
      };
    },
  };
  PingletWidget.init({
    endpoint,
    configuredDomain,
    projectIds,
    pingletId,
  });
  global.PingletWidget = PingletWidget;

  console.log(
    "%cPingletWidget initialized successfully.",
    "color: #1e90ff; font-weight: bold;"
  );
})(window);
