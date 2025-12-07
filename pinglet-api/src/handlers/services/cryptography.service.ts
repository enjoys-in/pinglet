import { createCipheriv } from "node:crypto";

export function encryptToString(value: string, key: string, iv: string) {
	if (key.length !== 32) {
		throw new Error("Key must be 32 bytes (256 bits)");
	}
	if (iv.length !== 12) {
		throw new Error("IV must be 12 bytes (96 bits)");
	}

	const cipher = createCipheriv("aes-256-gcm", key, iv);
	let encrypted = cipher.update(value, "utf8");
	encrypted = Buffer.concat([encrypted, cipher.final()]);
	const tag = cipher.getAuthTag();

	return {
		encrypted: encrypted.toString("base64"),
		tag: tag.toString("base64"),
	};
}
