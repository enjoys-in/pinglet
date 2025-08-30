/**
 * @typedef {Object} TemplateRespons
 * @property {number} id
 * @property {string} compiled_text
 * @property {Config} config
 * @property {boolean} is_active
 * @property {boolean} is_default
 */

/**
 * @typedef {Object} Config
 * @property {Btn1} btn1
 * @property {Btn2} btn2
 * @property {Media} media
 * @property {Title} title
 * @property {Controls} controls
 * @property {number} duration
 * @property {Description} description
 */

/**
 * @typedef {Object} Btn1
 * @property {string} color
 * @property {string} border
 * @property {string} padding
 * @property {string} fontSize
 * @property {string} boxShadow
 * @property {string} fontWeight
 * @property {string} borderRadius
 * @property {string} backgroundColor
 */

/**
 * @typedef {Object} Btn2
 * @property {string} color
 * @property {string} border
 * @property {string} padding
 * @property {string} fontSize
 * @property {string} fontWeight
 * @property {string} borderRadius
 * @property {string} backgroundColor
 */

/**
 * @typedef {Object} Media
 * @property {Icon} icon
 * @property {Logo} logo
 * @property {Audio} audio
 * @property {Image} image
 * @property {Video} video
 * @property {Iframe} iframe
 */

/**
 * @typedef {Object} Icon
 * @property {string} width
 * @property {string} height
 * @property {string} margin
 * @property {string} objectFit
 */

/**
 * @typedef {Object} Logo
 * @property {string} width
 * @property {string} height
 * @property {string} margin
 * @property {string} objectFit
 */

/**
 * @typedef {Object} Audio
 * @property {string} width
 * @property {string} margin
 */

/**
 * @typedef {Object} Image
 * @property {string} width
 * @property {string} height
 * @property {string} margin
 * @property {string} objectFit
 * @property {string} borderRadius
 */

/**
 * @typedef {Object} Video
 * @property {string} width
 * @property {string} height
 * @property {string} margin
 * @property {string} objectFit
 * @property {string} borderRadius
 */

/**
 * @typedef {Object} Iframe
 * @property {string} width
 * @property {string} height
 * @property {string} margin
 * @property {string} objectFit
 * @property {string} borderRadius
 */

/**
 * @typedef {Object} Title
 * @property {string} color
 * @property {string} margin
 * @property {string} fontSize
 * @property {string} textAlign
 * @property {string} fontWeight
 * @property {string} lineHeight
 */

/**
 * @typedef {Object} Controls
 * @property {Audio2} audio
 * @property {Video2} video
 */

/**
 * @typedef {Object} Audio2
 * @property {boolean} loop
 * @property {boolean} muted
 * @property {boolean} autoplay
 * @property {boolean} controls
 */

/**
 * @typedef {Object} Video2
 * @property {boolean} loop
 * @property {boolean} muted
 * @property {boolean} autoplay
 * @property {boolean} controls
 */

/**
 * @typedef {Object} Description
 * @property {string} color
 * @property {string} margin
 * @property {string} fontSize
 * @property {string} textAlign
 * @property {string} fontWeight
 * @property {string} lineHeight
 */
export {
    TemplateRespons,
    Config,
    Btn1,
    Btn2,
    Media,
    Icon,
    Logo,
    Audio,
    Image,
    Video,
    Iframe,
    Title,
    Controls,
    Audio2,
    Video2,
    Description
}