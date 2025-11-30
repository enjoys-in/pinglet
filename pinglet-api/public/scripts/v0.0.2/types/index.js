/**
 * @module types
 */

/** @typedef {import('./project.config.js').ProjectConfig} ProjectConfig */
/** @typedef {import('./template.config.js').TemplateStyleConfig} TemplateStyleConfig  */

/**
 * @typedef {Object} MediaData
 * @property {import('./template.config.js').MediaType} type
 * @property {string} src
 */

/**
 * @typedef {Object} NotificationDataBody
 * @property {string} [variant]
 * @property {string} title
 * @property {string} [description]
 * @property {string} [icon]
 * @property {string} [logo]
 * @property {string} [url]
 * @property {MediaData} [media]
 * @property {Array<{ text: string, action: string }>} [buttons]

 */
/**
 * @typedef {Object} NotificationData
 * @property {string} project_id
 * @property {string} [template_id]
 * @property {string} tag
 * @property {1|0|-1} type // -1, 0, 1 default is 0
 * @property {NotificationDataBody} [body]
 * @property {Object} [overrides]
 * @property {Object} [data]
 * @property {Object} [custom_template]
 * 

 */

/**
 * @typedef {Object} NotificationDataForBrowser
 * @property {string} project_id
 * @property {string} [template_id]
 * @property {string} tag
 * @property {1|0|-1} type // -1, 0, 1 default is 0
 * @property {NotificationDataBody} [body]
 * @property {Object} [overrides]
 * @property {Object} [data]

 */
/**
 * @typedef {Object} NotificationDataCustomTemplate
 * @property {string} project_id
 * @property {string} [template_id]
 * @property {string} tag
 * @property {1|0|-1} type // -1, 0, 1 default is 0 
 * @property {Object} [overrides]
 * @property {Object} [data]
 * @property {Object} 

 */

/**
 * @typedef {Object} PingletWidget
 * @property {string} version
 * @property {string} checksum
 */
/**
 * @typedef {Object} TemplateData
 * @property {string|number} [id]
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
 *    @property {ProjectConfig} config
 */

export {
  GlobalConfig,
  NotificationData,
  PingletWidget,
  TemplateData,
  Templates,
  MediaData,
};
