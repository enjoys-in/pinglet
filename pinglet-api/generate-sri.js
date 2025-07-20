const fs = require("fs");
const crypto = require("crypto");
const rollup = require("./rollup.config.js").default;
const filePath = rollup.output.file;
const match = filePath.match(/\/v([\d.]+)\//);
const version = match ? match[1] : null;
const fileContent = fs.readFileSync(filePath);
const hash = crypto.createHash("sha384").update(fileContent).digest("base64");

const sri = `sha384-${hash}`;
const versionsPath = "./sdkVersions.json";


let sdkVersions = {};
if (fs.existsSync(versionsPath)) {
  sdkVersions = JSON.parse(fs.readFileSync(versionsPath, "utf-8"));
}


sdkVersions[version] = sri;
fs.writeFileSync(versionsPath, JSON.stringify(sdkVersions, null, 2), "utf-8");

console.log(`✔️ SRI for version v${version} updated:\n${sri}`);