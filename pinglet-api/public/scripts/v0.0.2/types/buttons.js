/**
 * @module ButtonsTypes
 */

/**
 * @typedef {Object} BaseButton
 * @property {string} text
 * @property {"redirect" | "link" | "alert" | "event" | "reload" | "close"| "onClick"} action
 */

/**
 * @typedef {BaseButton & {
 *   action: "onClick"
 *   onClick: string
 * }} ButtonOnClick
 */
/**
 * @typedef {BaseButton & {
 *   action: "reload" | "close"
 * }} ButtonReloadOrClose
 */

/**
 * @typedef {BaseButton & {
 *   action: "redirect" | "link" | "alert"
 *   src: string
 * }} ButtonWithSrc
 */

/**
 * @typedef {BaseButton & {
 *   action: "event"
 *   event: string
 *   data?: Object
 * }} ButtonWithEvent
 */

/**
 * @typedef {ButtonReloadOrClose | ButtonWithSrc | ButtonWithEvent | ButtonOnClick} ButtonsData
 */

export { ButtonsData };
