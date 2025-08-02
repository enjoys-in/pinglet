/**
 * @fileoverview Browser-side Web Notification JSDoc type definitions
 */

// ===== CORE NOTIFICATION TYPES =====

/**
 * @typedef {Object} NotificationOptions
 * @property {string} [body] - The notification body text
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

/**
 * @typedef {Object} NotificationAction
 * @property {string} action - Unique identifier for the action
 * @property {string} title - Text displayed on the action button
 * @property {string} [icon] - URL to action button icon
 */

/**
 * @typedef {'default'|'denied'|'granted'} NotificationPermission
 */

// ===== PUSH SUBSCRIPTION TYPES =====

/**
 * @typedef {Object} PushSubscription
 * @property {string} endpoint - Push service endpoint URL
 * @property {PushSubscriptionKeys} keys - Encryption keys
 * @property {number|null} [expirationTime] - Subscription expiration timestamp
 */

/**
 * @typedef {Object} PushSubscriptionKeys
 * @property {string} p256dh - Base64 encoded P-256 ECDH public key
 * @property {string} auth - Base64 encoded authentication secret
 */

/**
 * @typedef {Object} PushSubscriptionOptions
 * @property {boolean} userVisibleOnly - Must be true for web push
 * @property {Uint8Array|string} [applicationServerKey] - VAPID public key
 */

// ===== SERVICE WORKER EVENT TYPES =====

/**
 * @typedef {Object} PushEvent
 * @extends {ExtendableEvent}
 * @property {PushMessageData|null} data - Push message data
 */

/**
 * @typedef {Object} PushMessageData
 * @property {function(): ArrayBuffer} arrayBuffer - Get data as ArrayBuffer
 * @property {function(): Blob} blob - Get data as Blob
 * @property {function(): *} json - Parse data as JSON
 * @property {function(): string} text - Get data as text
 */

/**
 * @typedef {Object} NotificationEvent
 * @extends {ExtendableEvent}
 * @property {Notification} notification - The notification object
 * @property {string} [action] - Action identifier if action button clicked
 */

// ===== CUSTOM NOTIFICATION PAYLOAD TYPES =====

/**
 * @typedef {Object} CustomNotificationPayload
 * @property {string} title - Notification title
 * @property {string} [body] - Notification body text
 * @property {string} [icon] - Icon URL
 * @property {string} [badge] - Badge icon URL
 * @property {string} [image] - Large image URL
 * @property {string} [tag] - Notification tag
 * @property {boolean} [requireInteraction] - Prevent auto-dismiss
 * @property {boolean} [silent] - Silent notification
 * @property {NotificationDataPayload} [data] - Custom data
 * @property {NotificationAction[]} [actions] - Action buttons
 * @property {number[]} [vibrate] - Vibration pattern
 * @property {number} [timestamp] - Timestamp
 */

/**
 * @typedef {Object} NotificationDataPayload
 * @property {string} [url] - URL to open when clicked
 * @property {number} [duration] - Auto-dismiss duration in milliseconds
 * @property {string} [userId] - Associated user ID
 * @property {string} [notificationId] - Unique notification identifier
 * @property {Object.<string, *>} [metadata] - Additional metadata
 */

// ===== NOTIFICATION CATEGORIES =====

/**
 * @typedef {'message'|'alert'|'reminder'|'update'|'social'|'marketing'|'system'|'emergency'} NotificationType
 */

/**
 * @typedef {'low'|'normal'|'high'|'urgent'} NotificationPriority
 */

/**
 * @typedef {Object} TypedNotificationPayload
 * @extends {CustomNotificationPayload}
 * @property {NotificationType} type - Notification category
 * @property {NotificationPriority} priority - Notification priority
 * @property {string} [category] - Custom category
 * @property {string} [groupId] - Group identifier
 */

// ===== PERMISSION AND SUPPORT TYPES =====

/**
 * @typedef {Object} NotificationSupport
 * @property {boolean} notification - Basic Notification API support
 * @property {boolean} serviceWorker - Service Worker support
 * @property {boolean} pushManager - Push Manager support
 * @property {boolean} actions - Notification actions support
 * @property {boolean} badge - Badge icon support
 * @property {boolean} image - Large image support
 * @property {boolean} vibrate - Vibration support
 * @property {boolean} silent - Silent notification support
 * @property {boolean} requireInteraction - Persistent notification support
 */

/**
 * @typedef {Object} PermissionStatus
 * @property {NotificationPermission} permission - Current permission state
 * @property {boolean} canShowNotifications - Can show notifications
 * @property {boolean} isPushSupported - Push notifications supported
 * @property {boolean} isServiceWorkerSupported - Service Worker supported
 */

// ===== SETTINGS AND CONFIGURATION =====

/**
 * @typedef {Object} NotificationSettings
 * @property {boolean} enabled - Notifications enabled
 * @property {Object.<NotificationType, boolean>} types - Enabled notification types
 * @property {QuietHours} quietHours - Quiet hours configuration
 * @property {boolean} sound - Sound enabled
 * @property {boolean} vibration - Vibration enabled
 * @property {number} duration - Default duration in milliseconds
 */

/**
 * @typedef {Object} QuietHours
 * @property {boolean} enabled - Quiet hours enabled
 * @property {string} start - Start time in HH:MM format
 * @property {string} end - End time in HH:MM format
 */

/**
 * @typedef {Object} NotificationDefaults
 * @property {string} icon - Default icon URL
 * @property {string} badge - Default badge URL
 * @property {number} duration - Default duration in milliseconds
 * @property {number[]} vibrate - Default vibration pattern
 */

// ===== ERROR HANDLING TYPES =====

/**
 * @typedef {Object} NotificationError
 * @property {'PERMISSION_DENIED'|'NOT_SUPPORTED'|'SUBSCRIPTION_FAILED'|'SEND_FAILED'} code - Error code
 * @property {string} message - Error message
 * @property {*} [details] - Additional error details
 */

// ===== UTILITY FUNCTIONS JSDoc =====

/**
 * Request notification permission from user
 * @returns {Promise<NotificationPermission>} Permission status
 */
async function requestNotificationPermission() {}

/**
 * Check if notifications are supported
 * @returns {NotificationSupport} Support status object
 */
function checkNotificationSupport() {}

/**
 * Create and show a notification
 * @param {string} title - Notification title
 * @param {NotificationOptions} [options] - Notification options
 * @returns {Notification} Notification instance
 */
function showNotification(title, options) {}

/**
 * Subscribe to push notifications
 * @param {string} vapidPublicKey - VAPID public key
 * @returns {Promise<PushSubscription>} Push subscription
 */
async function subscribeToPush(vapidPublicKey) {}

/**
 * Get existing push subscription
 * @returns {Promise<PushSubscription|null>} Existing subscription or null
 */
async function getExistingSubscription() {}

/**
 * Unsubscribe from push notifications
 * @returns {Promise<boolean>} Success status
 */
async function unsubscribeFromPush() {}

/**
 * Convert VAPID key from base64 to Uint8Array
 * @param {string} base64String - Base64 encoded VAPID key
 * @returns {Uint8Array} Converted key
 */
function urlBase64ToUint8Array(base64String) {}

/**
 * Handle notification click event
 * @param {NotificationEvent} event - Notification click event
 */
function handleNotificationClick(event) {}

/**
 * Handle notification close event
 * @param {NotificationEvent} event - Notification close event
 */
function handleNotificationClose(event) {}

/**
 * Handle push message event
 * @param {PushEvent} event - Push message event
 */
function handlePushMessage(event) {}

// ===== EXAMPLE USAGE WITH JSDOC =====

/**
 * Example notification manager class
 * @class
 */
class NotificationManager {
  /**
   * @param {NotificationDefaults} defaults - Default notification settings
   */
  constructor(defaults) {
    /** @type {NotificationDefaults} */
    this.defaults = defaults;
    
    /** @type {PushSubscription|null} */
    this.subscription = null;
    
    /** @type {NotificationSettings} */
    this.settings = {
      enabled: true,
      types: {},
      quietHours: { enabled: false, start: '22:00', end: '08:00' },
      sound: true,
      vibration: true,
      duration: 5000
    };
  }

  /**
   * Initialize notification manager
   * @param {string} vapidPublicKey - VAPID public key
   * @returns {Promise<boolean>} Success status
   */
  async init(vapidPublicKey) {}

  /**
   * Show a notification with type checking
   * @param {TypedNotificationPayload} payload - Notification payload
   * @returns {Promise<Notification>} Notification instance
   */
  async showTypedNotification(payload) {}

  /**
   * Check if notifications are allowed at current time
   * @returns {boolean} Whether notifications are allowed
   */
  isNotificationTimeAllowed() {}
}