/**
 * Initialize the widget by creating a sound player if the sound config is
 * enabled and has a valid src.
 *
 * @param {GlobalConfig} globalConfig - Global config object passed to the widget.
 * @returns {Audio|undefined} The created sound player or undefined if the
 * sound config is disabled.
 */
export function initWidget(globalConfig: GlobalConfig): (new (src?: string) => HTMLAudioElement) | undefined;
/**
 * Renders a new toast notification with a given content element.
 * @param {HTMLElement} contentEl the content element of the toast notification
 * @param {GlobalConfig} globalConfig the global config object
 */
export function renderToast(contentEl: HTMLElement, globalConfig: GlobalConfig): void;
export let toastStack: null;
export let brandingElement: null;
/**
 * ('./types/index.js').GlobalConfig
 */
type _import = any;
export { _import as import };
