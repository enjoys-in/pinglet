/**
 * Pinglet SDK v0.0.3 — Template Loading
 * Fetches project notification templates from the API.
 */

/**
 * Load all templates for a project.
 * @param {string} endpoint - API base URL
 * @param {string} projectId - Project ID
 * @param {string} pingletId - Pinglet signature
 * @param {string} checksum - SRI checksum
 * @param {string} version - SDK version
 * @param {string} templatesIds - Comma-separated template IDs
 * @returns {Promise<Object|null>} Templates map or null
 */
export async function loadAllTemplates(endpoint, projectId, pingletId, checksum, version, templatesIds) {
	try {
		const response = await fetch(
			`${endpoint}/load/templates?projectId=${projectId}&templatesIds=${templatesIds}`,
			{
				headers: {
					"X-Project-ID": projectId,
					"X-Timestamp": Date.now(),
					"X-Pinglet-Signature": pingletId,
					"X-Pinglet-Checksum": checksum,
					"X-Pinglet-Version": version,
				},
				credentials: "omit",
			},
		);

		const data = await response.json();
		if (!data || !data.success) return null;
		return data.result;
	} catch (err) {
		console.error("[Pinglet] Failed to load templates:", err);
		return null;
	}
}
