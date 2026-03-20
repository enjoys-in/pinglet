/**
 * Pinglet SDK v0.0.3 — Consolidated Type Definitions
 * All JSDoc typedefs for the Pinglet notification SDK.
 */

// ─── Button Types ───

/**
 * @typedef {Object} ButtonData
 * @property {string} text - Button label
 * @property {"redirect"|"open"|"link"|"alert"|"reload"|"event"|"close"|"dismiss"|"onClick"} [action] - Action type
 * @property {string} [src] - URL or alert message (for redirect/link/alert actions)
 * @property {string} [event] - Custom event name dispatched on window when action is "event" (backend field)
 * @property {string} [eventName] - Alias for `event` (SDK field, same purpose)
 * @property {Object} [payload] - Custom payload sent as event.detail when action is "event"
 * @property {*} [data] - Alias for `payload` (backend field, same purpose)
 * @property {string} [onClick] - Inline function string (evaluated safely, action must be "onClick")
 * @property {string} [icon] - Button icon URL
 */

// ─── Media Types ───

/**
 * @typedef {"image"|"video"|"audio"|"iframe"} MediaType
 */

/**
 * @typedef {Object} MediaData
 * @property {MediaType} type - Media type
 * @property {string} src - Media source URL
 */

/**
 * @typedef {Object} MediaControls
 * @property {{ autoplay: boolean, muted: boolean, loop: boolean, controls: boolean }} [video]
 * @property {{ autoplay: boolean, muted: boolean, loop: boolean, controls: boolean }} [audio]
 */

/**
 * @typedef {Object} MediaStyleMap
 * @property {Partial<CSSStyleDeclaration>} [image]
 * @property {Partial<CSSStyleDeclaration>} [video]
 * @property {Partial<CSSStyleDeclaration>} [audio]
 * @property {Partial<CSSStyleDeclaration>} [iframe]
 */

// ─── Style Types ───

/**
 * @typedef {Object} TemplateStyleConfig
 * @property {number} [duration] - Auto-close duration in ms
 * @property {Partial<CSSStyleDeclaration>} [btn1] - Primary button styles
 * @property {Partial<CSSStyleDeclaration>} [btn2] - Secondary button styles
 * @property {Partial<CSSStyleDeclaration>} [title] - Title styles
 * @property {Partial<CSSStyleDeclaration>} [description] - Description styles
 * @property {MediaControls} [controls] - Media controls config
 * @property {MediaStyleMap} [media] - Media element styles
 */

// ─── Notification Body ───

/**
 * @typedef {Object} NotificationBody
 * @property {string} [title] - Notification title
 * @property {string} [description] - Notification body text
 * @property {string} [icon] - Small icon URL
 * @property {string} [logo] - Logo URL
 * @property {string} [url] - Click-through URL
 * @property {MediaData} [media] - Rich media attachment
 * @property {ButtonData[]} [buttons] - Action buttons (max 3)
 * @property {string} [variant] - Variant name
 */

// ─── Notification Payload (SSE) ───

/**
 * @typedef {Object} NotificationData
 * @property {"-1"|"0"|"1"|"2"} type - Notification type
 * @property {NotificationBody} [body] - Notification content
 * @property {string} [template_id] - Template identifier (type 1)
 * @property {boolean} [custom_template] - Whether using custom template (type 1)
 * @property {Object} [data] - Template data (type 1)
 * @property {Object} [overrides] - Config overrides (premium)
 */

// ─── Project Configuration ───

/**
 * @typedef {Object} SoundConfig
 * @property {boolean} play - Whether to play notification sound
 * @property {string} [src] - Sound file URL
 * @property {number} [volume] - Volume 0-1 (default 0.5)
 */

/**
 * @typedef {Object} ThemeConfig
 * @property {"light"|"dark"|"auto"} [mode] - Theme mode (default "auto")
 * @property {string} [customClass] - Custom CSS class
 * @property {boolean} [rounded] - Whether to use rounded corners
 * @property {boolean} [shadow] - Whether to show shadow
 * @property {boolean} [border] - Whether to show border
 */

/**
 * @typedef {Object} BrandingConfig
 * @property {boolean} show - Whether to show branding
 * @property {boolean} [once] - Show branding once
 * @property {string} [html] - Custom branding HTML
 */

/**
 * @typedef {Object} ProgressBarConfig
 * @property {boolean} show - Whether to show progress bar
 * @property {string} [color] - Progress bar color
 */

/**
 * @typedef {Object} ProjectConfig
 * @property {"bottom-left"|"bottom-right"|"top-left"|"top-right"} [position] - Notification position
 * @property {"fade"|"slide"|"zoom"} [transition] - Entrance animation
 * @property {SoundConfig} [sound] - Sound configuration
 * @property {number} [duration] - Auto-close duration in ms
 * @property {number} [maxVisible] - Maximum visible notifications
 * @property {boolean} [stacking] - Enable stacking
 * @property {boolean} [auto_dismiss] - Auto dismiss enabled
 * @property {boolean} [dismissible] - Show close button
 * @property {ThemeConfig} [theme] - Theme configuration
 * @property {BrandingConfig} [branding] - Branding configuration
 * @property {ProgressBarConfig} [progressBar] - Progress bar configuration
 * @property {boolean} [website] - Show website domain
 * @property {boolean} [favicon] - Show favicon/Pinglet branding
 * @property {boolean} [time] - Show timestamp
 */

// ─── Global Config (merged server + defaults) ───

/**
 * @typedef {Object} TemplateData
 * @property {string} compiled_text - Compiled template text
 * @property {ProjectConfig} config - Template config
 * @property {boolean} is_active - Whether template is active
 * @property {boolean} is_default - Whether it is the default template
 */

/**
 * @typedef {Object} GlobalConfig
 * @property {boolean} is_tff - Whether project is premium
 * @property {Record<string, TemplateData>} templates - Loaded templates
 * @property {TemplateStyleConfig} style - Merged style configuration
 * @property {ProjectConfig} config - Merged project configuration
 */

// ─── Native Push Notification Payload ───

/**
 * @typedef {Object} NativePushPayload
 * @property {string} title - Notification title
 * @property {string} [body] - Notification body
 * @property {string} [icon] - Icon URL
 * @property {string} [badge] - Badge URL
 * @property {string} [image] - Image URL
 * @property {string} [tag] - Deduplication tag
 * @property {boolean} [requireInteraction] - Prevent auto-dismiss
 * @property {boolean} [silent] - Silent notification
 * @property {Object} [data] - Arbitrary data
 * @property {Array<{action: string, title: string, icon?: string}>} [actions] - Action buttons
 * @property {number} [timestamp] - Timestamp
 * @property {number[]} [vibrate] - Vibration pattern
 */

/**
 * @typedef {Object} NotificationEventPayload
 * @property {string} project_id - Project ID
 * @property {string} [notification_id] - Notification ID
 * @property {number} timestamp - Event timestamp
 * @property {string} [reason] - Dismiss reason
 * @property {string} [type] - Notification type
 * @property {string} [notificationTag] - Notification tag (for SW events)
 */
