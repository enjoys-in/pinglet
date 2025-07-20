/** @typedef {import('./types.js').ShowPopup} ShowPopup */
/** @type {ShowPopup} */
export function _showPopup(title: any, description: any, buttons?: {
    text: string;
    onClick: () => Window | null;
}[], icon?: string): HTMLElement;
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
export type ShowPopup = any;
