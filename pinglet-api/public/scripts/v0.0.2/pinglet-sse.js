/** @typedef {import('./types/index.js').NotificationData} NotificationData */
/** @typedef {import('./types/index.js').GlobalConfig} GlobalConfig */

import {
  _showPopup,
  defaultConfig,
  defaultStyles,
  injectFont,
} from "./default.js";

import { loadAllTemplates } from "./load-templates.js";
import {
  TriggerBrowserNotificationApi,
  askNotificationPermissionFunction,
} from "./push-notification.js";
import { ShowTestimonials } from "./testimonials.js";
import { createVariant } from "./variants.js";
import {
  createBrandingElement,
  initWidget,
  playSound,
  prepareEventBody,
  renderToast,
} from "./widget.js";
import { showHtmlNotification } from "./html-notification.js";
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
const templatesIds = currentScript?.dataset.templates;

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
    version: "1.2.3",
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

      if (!pingletId) {
        _showPopup(
          "Configuration Error",
          "Missing Pinglet ID.",
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
        return console.error("Missing pingletId.");
      }
      if (!endpoint) {
        _showPopup(
          "Configuration Error",
          "Missing Endpoint.",
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
        return console.error("Missing pingletId.");
      }
      if (this.version !== "1.2.3") {
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
      let allTemplates = {};
      if (!templatesIds) {
        allTemplates = await loadAllTemplates(
          endpoint,
          projectId,
          pingletId,
          this.checksum,
          this.version,
          templatesIds
        );
        if (!allTemplates) {
          _showPopup(
            "Configuration Error",
            "Failed to load templates for PingletWidget."
          );
        }
      }

      /** @type {GlobalConfig} */
      const mergedConfig = Object.assign({}, defaultConfig, data.result.config);
      // Derive sound URL from endpoint if not set by server config
      if (!mergedConfig.sound?.src) {
        mergedConfig.sound = Object.assign({}, mergedConfig.sound, {
          src: `${endpoint}/pinglet-sound.mp3?v=1&ext=mp3`,
        });
      }
      const globalConfig = {
        is_tff: data.result?.is_premium ?? false,
        templates: Object.assign(
          {},
          {
            default: {
              compiled_text: _showPopup.toString(),
              config: defaultConfig,
              is_active: true,
              is_default: true,
            },
          },
          allTemplates
        ),
        style: Object.assign({}, defaultStyles, data.result.template?.config),
        config: mergedConfig,
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

        globalConfig?.is_tff &&
          Object.assign(
            globalConfig.config,
            globalConfig.config,
            data?.overrides ?? {}
          );

        // User created Templates will load here and we parse the data
        if (
          parsed?.type === "1" &&
          parsed?.template_id &&
          parsed?.custom_template
        ) {
          // fetch the template from globalConfig
          /** @type {import("./types/index.js").TemplateData} */
          const template = globalConfig.templates[parsed.template_id];
          if (!template || template.compiled_text.length === 0) {
            return console.error("Template not found");
          }
          let element;
          try {
            const func = new Function(
              `return ${template.compiled_text?.trim()}`
            )();
            element = func(parsed?.custom_template);
          } catch (e) {
            return console.error("[Pinglet] Failed to execute template:", e);
          }
          let wrapper;
          if (globalConfig.config.sound) playSound();
          if (Array.isArray(element)) {
            wrapper = createWrapper(element, { side: "left" });
          } else {
            wrapper = createWrapper([element], { side: "left" });
          }
          wrapper.setAttribute(
            "data-notification-id",
            `${parsed?.project_id || projectId}-${Date.now()}`
          );
          wrapper.setAttribute("data-notification-type", parsed?.type || "1");
          wrapper.addEventListener("click", () => {
            prepareEventBody("clicked", wrapper, "user clicked");
            parsed.custom_template.url &&
              window.open(parsed.custom_template.url, "_blank");
          });

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
        // Glassmorphism HTML notification (type 2)
        if (parsed?.type === "2" && parsed?.body) {
          const cfg = globalConfig.config;
          const notificationId = `${parsed?.project_id || projectId}-${Date.now()}`;

          // Resolve theme mode
          const themeMode = cfg.theme?.mode || "auto";
          const prefersDark = themeMode === "dark" || (
            themeMode === "auto" && window.matchMedia?.("(prefers-color-scheme: dark)").matches
          );

          if (cfg.sound?.play) playSound();

          // Map position from globalConfig (bottom-left → bottom-left)
          const position = cfg.position || "top-right";

          // Build branding text
          const brandingHtml = cfg.branding?.show
            ? (cfg.branding?.html || "Notifications by Pinglet")
            : "";
          // Strip any HTML tags from branding for plain-text badge display
          const brandingText = brandingHtml.replace(/<[^>]*>/g, "").trim();

          showHtmlNotification({
            title: parsed.body.title || "",
            body: parsed.body.description || "",
            icon: parsed.body.icon || parsed.body.logo || "",
            image: parsed.body.media?.type === "image" ? parsed.body.media.src : "",
            media: parsed.body.media?.type && parsed.body.media?.type !== "image"
              ? { type: parsed.body.media.type, src: parsed.body.media.src }
              : null,
            url: parsed.body.url || "",
            buttons: parsed.body.buttons || [],
            domain: cfg.website || window.location.hostname,
            tag: parsed.tag || "",
            position,
            duration: cfg.auto_dismiss ? (cfg.duration || 6000) : 0,
            requireInteraction: !cfg.auto_dismiss,
            silent: false,
            dir: "ltr",
            timestamp: Date.now(),
            data: parsed.data || {},
            notification_id: notificationId,
            notification_type: "2",
            onClick: (data) => {
              if (parsed.body.url) {
                window.open(parsed.body.url, "_blank", "noopener,noreferrer");
              }
            },
            onAction: (action, data) => {
              const btn = (parsed.body.buttons || []).find(b => b.action === action);
              if (btn?.src) window.open(btn.src, "_blank", "noopener,noreferrer");
            },
          });
          return;
        }

        // only browser notifications
        if (parsed && parsed?.type === "-1") {
          TriggerBrowserNotificationApi(
            parsed.body?.title || "Notification",
            parsed.body?.description || "",
            parsed.body?.icon || ""
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
