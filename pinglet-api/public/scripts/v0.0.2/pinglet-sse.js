/** @typedef {import('./types/index.js').NotificationData} NotificationData */
/** @typedef {import('./types/index.js').GlobalConfig} GlobalConfig */

import {
  _showPopup,
  defaultConfig,
  defaultStyles,
  injectFont,
} from "./default.js";

import { createVariant } from "./variants.js";
import {
  createBrandingElement,
  initWidget,
  prepareEventBody,
  renderToast,
} from "./widget.js";
import { loadAllTemplates } from "./load-templates.js";
import {
  askNotificationPermissionFunction,
  TriggerBrowserNotificationApi,
} from "./push-notification.js";
import { ShowTestimonials } from "./testimonials.js";
import "./sw.js";
import "./main.js";
import { createWrapper } from "./wrapper-v2.js";
const scriptEl = Array.from(document.scripts).find(
  (s) => s.src.includes("pinglet-sse") && s.dataset.endpoint
);
const currentScript = scriptEl || document.currentScript;

const endpoint = currentScript?.dataset.endpoint;
const configuredDomain = currentScript?.dataset.configuredDomain;
const projectId = currentScript?.dataset.projectId;
const pingletId = currentScript?.dataset.pingletId;
const checksum = currentScript?.dataset.checksum;
const testimonials = currentScript?.dataset.testimonials;

(async (global) => {
  global.projectId = projectId;
  if (global.PingletWidget) {
    console.warn("PingletNotification is already initialized.");
    return;
  }
  injectFont();
  askNotificationPermissionFunction(endpoint, projectId, pingletId);
  testimonials && ShowTestimonials();

  const PingletWidget = {
    version: "1.1.3",
    checksum: checksum.replace("sha384-", ""),
    /**
     * Initialize the PingletWidget.
     * @param {Object} options Initialization options for PingletWidget.
     * @param {string} options.endpoint The endpoint URL for the Pinglet API.
     * @param {string} options.configuredDomain The configured domain for this widget.
     * @param {string} options.projectId The project ID for this widget.
     * @param {string} options.pingletId The pinglet ID for this widget.
     * @param {boolean} [options.loadTemplates] If true, loads all templates for this widget.
     * @returns {void}
     * @throws {Error} If the version of PingletWidget is not supported, or if the checksum is missing.
     */
    async init({ endpoint, configuredDomain, projectId, pingletId }) {
      console.log(
        "%cPingletWidget initialized successfully.",
        "color: #1e90ff; font-weight: bold;",
        this.version
      );
      if (this.version !== "1.1.3") {
        _showPopup(
          "Pinglet Unsupported Version",
          `PingletWidget version ${this.version} is not supported. Please update to the latest version.`,
          [
            {
              text: "See Docs",
              actions: "redirect",
              src: "https://pinglet.enjoys.in/docs",
            },
          ],
          "⚠️"
        );
        console.warn("Unsupported version detected.");
        return;
      }
      if (!this.checksum || !checksum) {
        return _showPopup("Configuration Error", "Missing checksum.");
      }

      const response = await fetch(
        `${endpoint}/load/projects?projectId=${projectId}&domain=${configuredDomain}`,
        {
          headers: {
            "X-Project-ID": projectId,
            "X-Timestamp": Date.now(),
            "X-Pinglet-Signature": pingletId,
            "X-Pinglet-Checksum": this.checksum,
            "X-Pinglet-Version": this.version,
            "X-Configured-Domain": configuredDomain,
            "X-Pinglet-Id": pingletId,
            // "X-Visitor-Id": result.visitorId,
            // "X-Visitor-confidence": result.confidence,
          },

          credentials: "omit",
        }
      );
      /** @type {{ result: GlobalConfig; message: string; success: boolean; }} */
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
              action: "reload",
            },
            {
              text: "See Docs",
              action: "redirect",
              src: "https://pinglet.enjoys.in/docs",
            },
          ],
          "❌"
        );
        return console.error("Failed to load configuration for PingletWidget.");
      }
      createBrandingElement(data.result.config.branding);
      /** @type {GlobalConfig["templates"]} */
      let allTemplates = await loadAllTemplates(
        endpoint,
        projectId,
        pingletId,
        this.checksum,
        this.version
      );
      if (!allTemplates) {
        _showPopup(
          "Configuration Error",
          "Failed to load templates for PingletWidget."
        );
      }

      /** @type {GlobalConfig} */
      const globalConfig = {
        is_tff: data.result?.is_premium ?? false,
        templates: Object.assign(
          {},
          {
            ["default"]: {
              compiled_text: _showPopup.toString(),
              config: defaultConfig,
              is_active: true,
              is_default: true,
            },
          },
          allTemplates
        ),
        style: Object.assign({}, defaultStyles, data.result.template?.config),
        config: Object.assign({}, defaultConfig, data.result.config),
      };

      initWidget(globalConfig);
      const socket = new EventSource(
        `${endpoint}/sse?projectId=${projectId}&pingletId=${pingletId}`,
        { withCredentials: false }
      );
      /**
       * Handle new messages from the server.
       * @param {MessageEvent} e - The message event.
       * @returns {void}
       * @throws {Error} If the JSON.parse fails.
       * @private
       */
      socket.onmessage = (e) => {
        /** @type {NotificationData} */
        const parsed = JSON.parse(e.data);

        const data = parsed.data;

        globalConfig?.is_tdd &&
          Object.assign(
            globalConfig.config,
            globalConfig.config,
            data?.overrides ?? {}
          );

        // User created Templates will load here and we parse the data
        if (parsed?.type === "1" && parsed?.template_id && parsed?.data) {
          // fetch the template from globalConfig
          /** @type {import("./types/index.js").TemplateData} */
          const template = globalConfig.templates[parsed.template_id];

          const elementWithData = interPolateTemplateWithData(
            template.compiled_text(),
            parsed?.data
          );

          const run = new Function(elementWithData + "\nreturn element;");
          const element = run();
          //  if (Array.isArray(element)) {
          //   createWrapper(element, { side: "left" });
          //   else {
          //    createWrapper([element], { side: "left" });
          // }

          // return document.body.appendChild(element);
          return;
        }

        // Customized Templates in form of  Push Notification
        if (parsed?.type === "0" && parsed?.body) {
          const variantEl = createVariant(parsed.body, globalConfig);
          variantEl.setAttribute(
            "data-notification-id",
            `${parsed?.project_id || projectId}-${Date.now()}`
          );
          variantEl.setAttribute("data-notification-type", parsed?.type || "0");
          const { toastContainer } = renderToast(variantEl, globalConfig);
          "url" in parsed.body &&
            toastContainer.addEventListener("click", () => {
              prepareEventBody("clicked", variantEl, "user clicked");
              variantEl.remove();
              window.open(parsed.body.url, "_blank");
            });
          return;
        }
        // only browser notifications
        if (parsed && parsed?.type === "-1") {
          TriggerBrowserNotificationApi(
            body.title,
            body.description,
            body.type?.icon?.src || ""
          );
        }
        // trigger browser notification
      };
    },
  };

  global.PingletWidget = PingletWidget;
  PingletWidget.init({
    endpoint,
    configuredDomain,
    projectId,
    pingletId,
  });
})(window);
