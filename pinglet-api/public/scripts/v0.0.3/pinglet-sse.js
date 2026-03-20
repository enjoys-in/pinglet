/**
 * Pinglet SDK v0.0.3 — Main Entry Point
 * Initializes the SDK, loads project config, connects SSE,
 * and dispatches notifications by type.
 * Type 0: Glassmorphism HTML notification (also handles legacy type 2).
 * Type 1: Custom template rendered inside glass container.
 * Type -1: Browser push (handled by service worker).
 */

/** @typedef {import('./types/index.js').NotificationData} NotificationData */
/** @typedef {import('./types/index.js').GlobalConfig} GlobalConfig */

import { defaultConfig, defaultStyles, SDK_VERSION } from "./config.js";
import { showPopup, handleButtonAction } from "./popup.js";
import { loadAllTemplates } from "./templates.js";
import { askNotificationPermission } from "./permission-dialog.js";
import { showTestimonials } from "./testimonials.js";
import {
	createBrandingElement,
	initSound,
	playSound,
} from "./toast.js";
import { showHtmlNotification } from "./html-notification.js";
import { injectFont, getScriptConfig } from "./utils.js";
import { initActivity } from "./activity.js";
import { initSessionRecording } from "./session.js";
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
					allTemplates = {};
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
			initActivity(endpoint, projectId);
			initSessionRecording(endpoint, projectId);

			// ─── SSE Connection ───

			const socket = new EventSource(
				`${endpoint}/sse?projectId=${projectId}&pingletId=${pingletId}`,
				{ withCredentials: false },
			);

			socket.onmessage = (e) => {
				/** @type {NotificationData} */
				const parsed = JSON.parse(e.data);
				const notifData = parsed.data;

				// Per-notification overrides — merged on top of global config without mutating it
				const overrides = parsed?.overrides || notifData?.overrides || {};

				// ─── Type -1: Browser Push (handled by SW) ───
				if (parsed?.type === "-1") return;

				// ─── Type 1: Custom Template in Glass Container ───
				if (parsed?.type === "1" && parsed?.template_id && parsed?.custom_template) {
					const template = globalConfig.templates[parsed.template_id];
					if (!template || !template.is_active) {
						showPopup("Template Error", `Template "${parsed.template_id}" not found or inactive.`);
						return;
					}

					try {
						const compiledFn = new Function(
							"data",
							"config",
							"globalConfig",
							template.compiled_text,
						);
						const result = compiledFn(
							parsed.data || {},
							template.config || {},
							globalConfig,
						);

						// Normalize to a single HTMLElement
						let customElement;
						if (result instanceof HTMLElement) {
							customElement = result;
						} else if (Array.isArray(result)) {
							customElement = document.createElement("div");
							for (const el of result) { if (el instanceof Node) customElement.appendChild(el); }
						} else {
							console.error("[Pinglet] Template did not return an HTMLElement.");
							return;
						}

						const cfg = Object.assign({}, globalConfig.config, overrides);
						if (overrides.theme && globalConfig.config.theme) {
							cfg.theme = Object.assign({}, globalConfig.config.theme, overrides.theme);
						}

						if (cfg.sound?.play) playSound();

						showHtmlNotification({
							customContent: customElement,
							position: cfg.position || "top-right",
							duration: cfg.auto_dismiss === false ? 0 : (cfg.duration || 6000),
							requireInteraction: cfg.auto_dismiss === false,
							domain: cfg.website || window.location.hostname,
							theme: cfg.theme?.mode || "auto",
							branding: cfg.branding || { show: true, html: 'Notifications by <a href="https://pinglet.enjoys.in" target="_blank" rel="noopener noreferrer">Pinglet</a>' },
							maxVisible: cfg.maxVisible || 3,
							notification_id: `${projectId}-${Date.now()}`,
							notification_type: "1",
						});
					} catch (err) {
						console.error("[Pinglet] Template render error:", err);
					}
					return;
				}

				// ─── Type 0 / 2: Glassmorphism HTML Notification ───
				if (parsed?.body) {
					const body = parsed.body || {};
					const cfg = Object.assign({}, globalConfig.config, overrides);
					if (overrides.theme && globalConfig.config.theme) {
						cfg.theme = Object.assign({}, globalConfig.config.theme, overrides.theme);
					}
					const theme = cfg.theme?.mode || "auto";

					if (cfg.sound?.play) playSound();

					const brandingHtml = cfg.branding?.show
						? (cfg.branding?.html || "Notifications by Pinglet")
						: "";
					const brandingText = brandingHtml.replace(/<[^>]*>/g, "").trim();

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
						tag: parsed.tag || "",
						position: cfg.position || "top-right",
						duration: cfg.auto_dismiss === false ? 0 : (cfg.duration || 6000),
						requireInteraction: cfg.auto_dismiss === false,
						domain: brandingText || cfg.website || window.location.hostname,
						theme,
						branding: cfg.branding || { show: true, html: 'Notifications by <a href="https://pinglet.enjoys.in" target="_blank" rel="noopener noreferrer">Pinglet</a>' },
						maxVisible: cfg.maxVisible || 3,
						notification_id: `${projectId}-${Date.now()}`,
						notification_type: parsed?.type || "0",
					});
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
