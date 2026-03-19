/**
 * Post-install patch script.
 * Applies patches for packages incompatible with Node.js v25+
 * where SlowBuffer has been removed.
 */
const fs = require("fs");
const path = require("path");

const patches = [
	{
		target: "node_modules/buffer-equal-constant-time/index.js",
		patch: "patches/buffer-equal-constant-time+1.0.1.js",
		reason: "SlowBuffer removed in Node.js v25",
	},
];

for (const p of patches) {
	const targetPath = path.join(__dirname, "..", p.target);
	const patchPath = path.join(__dirname, "..", p.patch);

	if (!fs.existsSync(targetPath)) continue;
	if (!fs.existsSync(patchPath)) {
		console.warn(`[patch] Patch file missing: ${p.patch}`);
		continue;
	}

	const patchContent = fs.readFileSync(patchPath, "utf-8");
	fs.writeFileSync(targetPath, patchContent, "utf-8");
	console.log(`[patch] Applied: ${p.target} (${p.reason})`);
}
