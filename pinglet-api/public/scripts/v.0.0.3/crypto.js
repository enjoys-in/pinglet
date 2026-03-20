/**
 * Pinglet SDK v0.0.3 — AES-GCM Cryptography
 * Decrypts encrypted notification payloads using Web Crypto API.
 */

const decoder = new TextDecoder();

/**
 * Derive a 256-bit key from an SRI hash (sha384 base64).
 * Takes the first 32 bytes of the decoded hash.
 * @param {string} sri - SRI hash string (e.g., "sha384-...")
 * @returns {Uint8Array} 32-byte key
 */
function get256BitKeyFromSRI(sri) {
	const base64 = sri.replace(/^sha384-/, "");
	const fullBytes = base64ToUint8Array(base64);
	return fullBytes.slice(0, 32);
}

/**
 * Decrypt an encrypted payload object.
 * @param {Object} payload - Encrypted payload
 * @param {string} payload.e - Base64-encoded ciphertext
 * @param {string} payload.k - SRI hash used as key source
 * @param {string} payload.i - Hex-encoded IV
 * @param {string} payload.t - Base64-encoded auth tag
 * @returns {Promise<string|null>} Decrypted plaintext or null on failure
 */
export async function decrypt({ e, k, i, t }) {
	try {
		const iv = hexToUint8Array(i);
		const keyBytes = get256BitKeyFromSRI(k);

		const cryptoKey = await window.crypto.subtle.importKey(
			"raw",
			keyBytes,
			"AES-GCM",
			false,
			["decrypt"],
		);

		const ciphertext = base64ToUint8Array(e);
		const authTag = base64ToUint8Array(t);

		// AES-GCM expects ciphertext + authTag concatenated
		const combined = new Uint8Array(ciphertext.length + authTag.length);
		combined.set(ciphertext, 0);
		combined.set(authTag, ciphertext.length);

		const decrypted = await window.crypto.subtle.decrypt(
			{ name: "AES-GCM", iv, tagLength: 128 },
			cryptoKey,
			combined,
		);

		return decoder.decode(decrypted);
	} catch (err) {
		console.error("[Pinglet] Decryption failed:", err);
		return null;
	}
}

// ─── Encoding Helpers ───

function hexToUint8Array(hex) {
	return new Uint8Array(
		hex.match(/.{1,2}/g).map((byte) => Number.parseInt(byte, 16)),
	);
}

function base64ToUint8Array(base64) {
	base64 = base64.replace(/^sha(256|384|512)-/, "");
	base64 = base64.replace(/-/g, "+").replace(/_/g, "/");
	base64 = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
	const binary = atob(base64);
	const bytes = new Uint8Array(binary.length);
	for (let i = 0; i < binary.length; i++) {
		bytes[i] = binary.charCodeAt(i);
	}
	return bytes;
}
