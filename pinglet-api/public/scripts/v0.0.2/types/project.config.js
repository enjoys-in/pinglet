/**
 * @typedef {CommonStyle} BrandingStyle
 */

/**
 * @typedef {Object} Branding
 * @property {boolean} show
 * @property {string} [html]
 * @property {BrandingStyle} [style]
 */

/**
 * @typedef {Object} ProjectConfig
 * @property {"top-right" | "top-left" | "bottom-right" | "bottom-left"} [position]
 * @property {"fade" | "slide" | "zoom"} [transition]
 * @property {{ show: boolean, html: string }} [branding]
 * @property {{ play: boolean, src: string, volume: number }} [sound]
 * @property {number} [duration]
 * @property {boolean} [auto_dismiss]
 * @property {number} [maxVisible]
 * @property {boolean} [stacking]
 * @property {boolean} [dismissible]
 * @property {boolean} [pauseOnHover]
 * @property {string} [website]
 * @property {boolean} [time]
 * @property {boolean} [favicon]
 * @property {{
 *   mode?: "light" | "dark" | "auto",
 *   customClass?: string,
 *   rounded?: boolean,
 *   shadow?: boolean,
 *   border?: boolean
 * }} [theme]
 * @property {{
 *   show?: boolean,
 *   size?: number,
 *   position?: "left" | "right" | "top"
 * }} [iconDefaults]
 * @property {{
 *   show?: boolean,
 *   color?: string,
 *   height?: number
 * }} [progressBar]
 */
