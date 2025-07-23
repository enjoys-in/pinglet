/** @typedef import('./types/project.config.js).ProjectConfig */
/**
 * @typedef {Object} ShowPopup
 * @param {string} title
 * @param {string} [description]
 * @param {Array<{ text: string, onClick: string }>} [buttons]
 * @param {string} [icon="⚠️"] -
 * @returns {HTMLElement}
 */
export function _showPopup(title: string, description?: string, buttons?: Array<{
    text: string;
    onClick: string;
}>, icon?: string): HTMLElement;
/**
 * Injects Manrope font via Google Fonts and applies it to all elements with
 * classes starting with "pinglet-".
 *
 * @returns {void}
 */
export function injectFont(): void;
/** @type {TemplateStyleConfig} */
export const defaultStyles: TemplateStyleConfig;
/** @type {ProjectConfig} */
export const defaultConfig: ProjectConfig;
/**
 * ('./types/project.config.js).ProjectConfig
 */
type _import = any;
export { _import as import };
export type ShowPopup = Object;
