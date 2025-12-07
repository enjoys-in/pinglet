const crypto = window.crypto;

const decoder = new TextDecoder();
function get256BitKeyFromSRI(sri) {
	const base64 = sri.replace(/^sha384-/, "");
	const fullBytes = base64ToUint8Array(base64); // Should be 48 bytes
	const keyBytes = fullBytes.slice(0, 32); // First 256 bits
	return keyBytes;
}
export async function changeToObject({ e, k, i, t }) {
	try {
		const iv = hexToUint8Array(i);
		const key = get256BitKeyFromSRI(k);

		const cryptoKey = await crypto.subtle.importKey(
			"raw",
			key,
			"AES-GCM",
			false,
			["decrypt"],
		);

		const ciphertext = base64ToUint8Array(e);
		const authTag = base64ToUint8Array(t);

		const combined = new Uint8Array(ciphertext.length + authTag.length);

		const decrypted = await crypto.subtle.decrypt(
			{
				name: "AES-GCM",
				iv,
				tagLength: 128,
			},
			cryptoKey,
			combined,
		);

		return decoder.decode(decrypted);
	} catch (error) {
		console.log(error);
	}
}
function hexToUint8Array(hex) {
	return new Uint8Array(
		hex.match(/.{1,2}/g).map((byte) => Number.parseInt(byte, 16)),
	);
}
function uint8ArrayToHex(uint8) {
	return Array.from(uint8, (byte) => byte.toString(16).padStart(2, "0")).join(
		"",
	);
}
function base64ToUint8Array(base64) {
	// Remove padding if any weird chars, add back correct padding
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

function uint8ArrayToBase64(uint8) {
	return btoa(String.fromCharCode(...uint8));
}
