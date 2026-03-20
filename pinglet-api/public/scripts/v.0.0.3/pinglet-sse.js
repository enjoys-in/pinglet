/**
 * Pinglet SDK v0.0.3 — Main Entry Point
 * Initializes the SDK, loads project config, connects SSE,
 * and dispatches notifications by type (-1, 0, 1, 2).
 */

/** @typedef {import('./types/index.js').NotificationData} NotificationData */
/** @typedef {import('./types/index.js').GlobalConfig} GlobalConfig */

import { defaultConfig, defaultStyles, SDK_VERSION } from "./config.js";
import { showPopup, handleButtonAction } from "./popup.js";
import { loadAllTemplates } from "./templates.js";
import { askNotificationPermission } from "./permission-dialog.js";
import { showTestimonials } from "./testimonials.js";
import { createVariant } from "./variant.js";
import {
	createBrandingElement,
	initSound,
	playSound,
	prepareEventBody,
	renderToast,
} from "./toast.js";
import { showHtmlNotification } from "./html-notification.js";
import { createWrapper } from "./wrapper.js";
import { injectFont, getScriptConfig } from "./utils.js";
import "./sw.js";
import "./events.js";

// ─── Read script data attributes ───

const {
	endpoint,
	configuredDomain,
	projectId,
	pingletId,
	checksum,
	testimonials,
	templatesIds,
} = getScriptConfig();

// ─── Bootstrap ───

(async (global) => {
	global.projectId = projectId;

	if (global.PingletWidget) {
		console.warn("[Pinglet] Already initialized.");
		return;
	}

	injectFont();
	askNotificationPermission(endpoint, projectId, pingletId);
	if (testimonials) showTestimonials();

	const PingletWidget = {
		version: SDK_VERSION,
		checksum: (checksum || "").replace("sha384-", ""),

		async init({ endpoint, configuredDomain, projectId, pingletId }) {
			console.log(
				"%cPingletWidget initialized successfully.",
				"color: #1e90ff; font-weight: bold;",
				this.version,
			);

			// ─── Validation ───

			if (!pingletId) {
				showPopup("Configuration Error", "Missing Pinglet ID.", [
					{ text: "Retry", action: "reload" },
					{ text: "See Docs", action: "redirect", src: "https://pinglet.enjoys.in/docs" },
				], "❌");
				return console.error("[Pinglet] Missing pingletId.");
			}

			if (!endpoint) {
				showPopup("Configuration Error", "Missing Endpoint.", [
					{ text: "Retry", action: "reload" },
					{ text: "See Docs", action: "redirect", src: "https://pinglet.enjoys.in/docs" },
				], "❌");
				return console.error("[Pinglet] Missing endpoint.");
			}

			if (this.version !== SDK_VERSION) {
				showPopup(
					"Pinglet Unsupported Version",
					`PingletWidget version ${this.version} is not supported. Please update to the latest version.`,
					[{ text: "See Docs", action: "redirect", src: "https://pinglet.enjoys.in/docs" }],
					"⚠️",
				);
				return;
			}

			if (!this.checksum || !checksum) {
				return showPopup("Configuration Error", "Missing checksum.");
			}

			// ─── Load project config ───

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
					},
					credentials: "omit",
				},
			);

			/** @type {{ result: GlobalConfig; message: string; success: boolean }} */
			const data = await response.json();

			if (!data || !data.success) {
				showPopup(
					"Configuration Error",
					`Failed to load configuration. ${data.message || "Unknown error"}`,
					[
						{ text: "Retry", action: "reload" },
						{ text: "See Docs", action: "redirect", src: "https://pinglet.enjoys.in/docs" },
					],
					"❌",
				);
				return console.error("[Pinglet] Failed to load configuration.");
			}

			createBrandingElement(data.result.config.branding);

			// ─── Load templates ───

			let allTemplates = {};
			if (!templatesIds) {
				allTemplates = await loadAllTemplates(
					endpoint,
					projectId,
					pingletId,
					this.checksum,
					this.version,
					templatesIds,
				);
				if (!allTemplates) {
					showPopup("Configuration Error", "Failed to load templates for PingletWidget.");
				}
			}

			// ─── Merge config ───

			/** @type {import('./types/index.js').ProjectConfig} */
			const mergedConfig = Object.assign({}, defaultConfig, data.result.config);

			// Derive sound URL from endpoint if not set
			if (!mergedConfig.sound?.src) {
				mergedConfig.sound = Object.assign({}, mergedConfig.sound, {
					src: `${endpoint}/pinglet-sound.mp3?v=1&ext=mp3`,
				});
			}

			/** @type {GlobalConfig} */
			const globalConfig = {
				is_tff: data.result?.is_premium ?? false,
				templates: Object.assign(
					{},
					{
						default: {
							compiled_text: showPopup.toString(),
							config: defaultConfig,
							is_active: true,
							is_default: true,
						},
					},
					allTemplates,
				),
				style: Object.assign({}, defaultStyles, data.result.template?.config),
				config: mergedConfig,
			};

			initSound(globalConfig);

			// ─── SSE Connection ───

			const socket = new EventSource(
				`${endpoint}/sse?projectId=${projectId}&pingletId=${pingletId}`,
				{ withCredentials: false },
			);

			socket.onmessage = (e) => {
				/** @type {NotificationData} */
				const parsed = JSON.parse(e.data);
				const notifData = parsed.data;

				// Premium config overrides
				if (globalConfig?.is_tff && notifData?.overrides) {
					Object.assign(globalConfig.config, notifData.overrides);
				}

				// ─── Type 1: Custom Template ───
				if (parsed?.type === "1" && parsed?.template_id && parsed?.custom_template) {
					const template = globalConfig.templates[parsed.template_id];
					if (!template || !template.is_active) {
						console.warn("[Pinglet] Template not found or inactive:", parsed.template_id);
						return;
					}

					try {
						const compiledFn = new Function(
							"data",
							"config",
							"globalConfig",
							template.compiled_text,
						);
						const elements = compiledFn(
							parsed.data || {},
							template.config || {},
							globalConfig,
						);

						if (elements instanceof HTMLElement) {
							createWrapper([elements], {
								side: globalConfig.config.position?.includes("left") ? "left" : "right",
							});
						} else if (Array.isArray(elements)) {
							createWrapper(elements, {
								side: globalConfig.config.position?.includes("left") ? "left" : "right",
							});
						}
					} catch (err) {
						console.error("[Pinglet] Template render error:", err);
					}
					return;
				}

				// ─── Type 2: HTML Notification (Glassmorphism) ───
				if (parsed?.type === "2") {
					const body = parsed.body || {};
					const cfg = globalConfig.config;
					const theme = cfg.theme?.mode || "auto";

					showHtmlNotification({
						title: body.title || "",
						body: body.description || "",
						icon: body.icon || "",
						image: body.media?.type === "image" ? body.media.src : "",
						media:
							body.media?.type && body.media?.type !== "image"
								? { type: body.media.type, src: body.media.src }
								: null,
						url: body.url || "",
						buttons: body.buttons || [],
						position: cfg.position || "top-right",
						duration: cfg.duration || 6000,
						requireInteraction: !cfg.auto_dismiss,
						domain: cfg.website ? window.location.hostname : "",
						theme,
						branding: cfg.branding,
						maxVisible: cfg.maxVisible || 3,
						notification_id: `${projectId}-${Date.now()}`,
						notification_type: "2",
					});
					return;
				}

				// ─── Type -1: Browser Push (handled by SW) ───
				if (parsed?.type === "-1") {
					// Push notifications are handled by the service worker
					return;
				}

				// ─── Type 0: Toast Notification (default) ───
				if (parsed?.body) {
					const variant = createVariant(parsed.body, globalConfig);
					renderToast(variant, globalConfig);
				}
			};

			socket.onerror = () => {
				console.warn("[Pinglet] SSE connection error. Reconnecting...");
			};
		},
	};

	global.PingletWidget = PingletWidget;

	// Auto-init from script data attributes
	if (endpoint && projectId && pingletId) {
		PingletWidget.init({ endpoint, configuredDomain, projectId, pingletId });
	}
})(window);
