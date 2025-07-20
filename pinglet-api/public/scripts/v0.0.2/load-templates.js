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

export async function loadAllTemplates(
  endpoint,
  projectId,
  pingletId,
  checksum,
  version
) {
  const response = await fetch(
    `${endpoint}/load/templates?projectId=${projectId}`,
    {
      headers: {
        "X-Project-ID": projectId,
        "X-Timestamp": Date.now(),
        "X-Pinglet-Signature": pingletId,
        "X-Pinglet-Checksum": checksum,
        "X-Pinglet-Version": version,
      },

      credentials: "omit",
    }
  );

  const data = await response.json();

  if (!data || !data.success) {
    return null;
  }
  return data.result;
}
