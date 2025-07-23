/**
 * Fetches all templates for a given project from the specified endpoint.
 *
 * @param {string} endpoint - The API endpoint URL.
 * @param {string} projectId - The unique identifier for the project.
 * @param {string} pingletId - The signature associated with the Pinglet instance.
 * @param {string} checksum - The checksum for request validation.
 * @param {string} version - The version of the Pinglet API being used.
 * @returns {Promise<Object|null>} - A promise that resolves to the templates result if successful, or null if unsuccessful.
 */
export function loadAllTemplates(endpoint: string, projectId: string, pingletId: string, checksum: string, version: string): Promise<Object | null>;
