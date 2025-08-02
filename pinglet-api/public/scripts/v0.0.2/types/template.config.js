/**
 * @typedef {"image" | "video" | "audio" | "iframe"} MediaType
 */

/**
 * @typedef {Object} CommonStyle
 * @property {string} [color]
 * @property {string} [backgroundColor]
 * @property {string} [fontSize]
 * @property {string} [fontWeight]
 * @property {string} [borderRadius]
 * @property {string} [padding]
 * @property {string} [margin]
 * @property {string} [border]
 * @property {string} [boxShadow]
 * @property {"left" | "center" | "right"} [textAlign]
 * @property {string} [fontFamily]
 * @property {string} [lineHeight]
 * @property {string|number} [width]
 * @property {string|number} [height]
 */

/**
 * @typedef {CommonStyle} ButtonStyle
 */

/**
 * @typedef {CommonStyle} TextStyle
 */

/**
 * @typedef {Object} MediaStyle
 * @property {"contain" | "cover"} [objectFit]
 * @property {string} [color]
 * @property {string} [backgroundColor]
 * @property {string} [fontSize]
 * @property {string} [fontWeight]
 * @property {string} [borderRadius]
 * @property {string} [padding]
 * @property {string} [margin]
 * @property {string} [border]
 * @property {string} [boxShadow]
 * @property {"left" | "center" | "right"} [textAlign]
 * @property {string} [fontFamily]
 * @property {string} [lineHeight]
 * @property {string|number} [width]
 * @property {string|number} [height]
 */
/**
 * @typedef {Object} MediaStyleMapStrict
 * @property {MediaStyle} [image]
 * @property {MediaStyle} [video]
 * @property {MediaStyle} [audio]
 * @property {MediaStyle} [iframe]
 */
/**
 * @typedef {Object<MediaType, MediaStyle>} MediaStyleMap
 * @description A map of MediaType keys to MediaStyle values.
 */
/**
 * @typedef {Object} MediaControls
 * @property {boolean} autoplay
 * @property {boolean} muted
 * @property {boolean} loop
 * @property {boolean} controls
 */

/**
 * @typedef {Object} TemplateStyleConfig
 * @property {ButtonStyle} [btn1]
 * @property {ButtonStyle} [btn2]
 * @property {TextStyle} [title]
 * @property {TextStyle} [description]
 * @property {Object.<MediaType & "icon"|"logo", MediaStyle>} [media]
 * @property {number} [duration]
 * @property {{ audio?: MediaControls, video?: MediaControls }} [controls]
 */
export {
  MediaType,
  ButtonStyle,
  TextStyle,
  MediaStyle,
  MediaStyleMap,
  MediaStyleMapStrict,
  MediaControls,
  TemplateStyleConfig,
};
