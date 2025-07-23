/**
 * Renders a template with the given data.
 *
 * @param {string} template - The template with title, description, and media keys.
 * @param {object} [data={}] - The data to replace the placeholders in the template.
 * @returns {{title: string, description: string, media: object}} The rendered template.
 */
export function renderTemplate(template: string, data?: object): {
    title: string;
    description: string;
    media: object;
};
