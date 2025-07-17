async function decryptAesGcm({ encrypted, iv, tag, key }) {
	const cryptoKey = await crypto.subtle.importKey(
		"raw",
		key,
		"AES-GCM",
		false,
		["decrypt"],
	);

	const decrypted = await crypto.subtle.decrypt(
		{
			name: "AES-GCM",
			iv: Uint8Array.from(atob(iv), (c) => c.charCodeAt(0)),
			tagLength: 128,
		},
		cryptoKey,
		Uint8Array.from(atob(encrypted), (c) => c.charCodeAt(0)),
	);

	return new TextDecoder().decode(decrypted);
}
