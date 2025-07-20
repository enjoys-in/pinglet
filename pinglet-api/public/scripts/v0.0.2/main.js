import {
  _showPopup,
  defaultConfig,
  defaultStyles,
  injectFont,
} from "./default.js";

import { createVariant } from "./variants.js";
import { initWidget, renderToast } from "./widget.js";
import { loadAllTemplates } from "./load-templates.js";

const scriptEl = Array.from(document.scripts).find(
  (s) => s.src.includes("main.js") && s.dataset.endpoint
);
const currentScript = scriptEl || document.currentScript;

const endpoint = currentScript?.dataset.endpoint;
const configuredDomain = currentScript?.dataset.configuredDomain;
const projectId = currentScript?.dataset.projectId;
const pingletId = currentScript?.dataset.pingletId;
const loadTemplates = currentScript?.dataset.loadTemplates;

(async (global) => {
  if (global.PingletWidget) {
    console.warn("PingletWidget is already initialized.");
    return;
  }
  injectFont();
  let allTemplates = {};
  const PingletWidget = {
    async init({ endpoint, configuredDomain, projectId, pingletId }) {
      const response = await fetch(
        `${endpoint}/load/projects?projectId=${projectId}&domain=${configuredDomain}`
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

      if (loadTemplates === "true") {
        const templates = await loadAllTemplates(endpoint, projectId);
        if (!templates) {
          _showPopup(
            "Configuration Error",
            "Failed to load templates for PingletWidget."
          );
        }
        allTemplates = templates;
      }
      const globalConfig = {
        templates: Object.assign(
          {},
          {
            ["default"]: {
              compiled_text: _showPopup,
              config: defaultConfig,
              is_active: true,
              is_default: true,
            },
          },
          loadTemplates === "true"
            ? allTemplates
            : {
                [String(data.result.template?.id.toString())]:
                  data.result.template,
              }
        ),
        style: Object.assign({}, defaultStyles, data.result.template?.config),
        config: Object.assign({}, defaultConfig, data.result.config),
      };

      initWidget(globalConfig);
      const socket = new EventSource(
        `${endpoint}/subscribe?projectId=${projectId}&pingletId=${pingletId}`
      );
      socket.onmessage = (e) => {
        const data = JSON.parse(e.data);

        if (data?.template_id) {
          const el = new Function(
            `return ${
              globalConfig.templates[String(data.template_id)].compiled_text
            }`
          );

          const fn = el();
          const element = fn(
            data.title,
            data.description,
            data.media,
            data.buttons
          );
          return renderToast(element, globalConfig);
        }

        const variantEl = createVariant(data, globalConfig);
        renderToast(variantEl, globalConfig);
      };
    },
  };
  PingletWidget.init({
    endpoint,
    configuredDomain,
    projectId,
    pingletId,
  });
  global.PingletWidget = PingletWidget;

  console.log(
    "%cPingletWidget initialized successfully.",
    "color: #1e90ff; font-weight: bold;"
  );
})(window);
