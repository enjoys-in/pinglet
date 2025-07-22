/**
 * @module types
 */

/** @typedef {import('./project.config.js').ProjectConfig}  */
/** @typedef {import('./template.config.js').TemplateStyleConfig}  */

/**
 * @typedef {Object} MediaData
 * @property {MediaType} type
 * @property {string} src
 */
/**
 * @typedef {Object} NotificationData
 * @property {string} project_id
 * @property {string} [template_id]
 * @property {string} [tag]
 * @property {number} [type] // -1, 0, 1 default is 0
 * @property {string} [variant]
 * @property {string} title
 * @property {string} [description]
 * @property {MediaData} [media]

 * @property {Array<{ text: string, action: string }>} [buttons]
 */



/**
 * @typedef {Object} PingletWidget
 * @property {string} version
 * @property {string} checksum
 */
/**
 * @typedef {Object} TemplateData
 * @property {string} compiled_text
 * @property {TemplateStyleConfig} config
 * @property {boolean} is_active
 * @property {boolean} is_default
 * /
/**
 * @typedef {Object} Templates
 *    @property {Object<string, TemplateData>}
 */
/**
 * @typedef {Object} GlobalConfig
 *    @property {string} [is_tff]
 *    @property {Templates} templates
 *    @property {TemplateStyleConfig} style
 *    @property {ProjectConfig}config
 *
 */
