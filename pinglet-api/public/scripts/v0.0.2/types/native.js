/**
 * @fileoverview Browser-side Web Notification JSDoc type definitions
 */

/**
 * @typedef {Object} NotificationPayloadOptions
 * @property {string} project_id - The project ID of the notification
 * @property {string} [body] - The notification body text
 * @property {string} [url] - The URL to open when the notification is clicked
 * @property {string} [icon] - URL to notification icon (recommended: 192x192px)
 * @property {string} [badge] - URL to badge icon (recommended: 96x96px, monochrome)
 * @property {string} [image] - URL to large notification image
 * @property {string} [tag] - Unique tag to prevent duplicate notifications
 * @property {*} [data] - Custom data object attached to notification
 * @property {boolean} [requireInteraction=false] - Prevents auto-dismiss
 * @property {boolean} [silent=false] - No sound or vibration
 * @property {number} [timestamp] - Unix timestamp for the notification
 * @property {number[]|number} [vibrate] - Vibration pattern for mobile devices
 * @property {NotificationAction[]} [actions] - Array of action buttons
 * @property {'auto'|'ltr'|'rtl'} [dir='auto'] - Text direction
 * @property {string} [lang] - Language code (e.g., 'en', 'es')
 * @property {boolean} [renotify=false] - Re-alert user for same tag
 */

export { NotificationPayloadOptions };
