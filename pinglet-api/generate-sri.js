const fs = require("fs");
const crypto = require("crypto");
const path = require("path");
const rollup = require("./rollup.config.js").default;

const outputFilePath = rollup.output.file;
const packageJsonPath = path.resolve(process.cwd(), "./public/libs/package.json");
const sdkVersionsPath = path.resolve(__dirname, "./sdkVersions.json");

// Step 1: Verify file exists and generate hash
if (!fs.existsSync(outputFilePath)) {
  console.error(`❌ Output file not found: ${outputFilePath}`);
  process.exit(1);
}

const fileContent = fs.readFileSync(outputFilePath);
const hash = crypto.createHash("sha384").update(fileContent).digest("base64");
const sri = `sha384-${hash}`;

// Step 2: Check if hash already exists in sdkVersions
let sdkVersions = {};
if (fs.existsSync(sdkVersionsPath)) {
  sdkVersions = JSON.parse(fs.readFileSync(sdkVersionsPath, "utf-8"));
}

const existingVersion = Object.entries(sdkVersions).find(
  ([_, storedHash]) => storedHash === sri
);

if (existingVersion) {
  console.log(`✅ Hash already exists for version v${existingVersion[0]}. No update needed.`);
  process.exit(0);
}

// Step 3: Read and bump version in package.json
const pkg = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
let [major, minor, patch] = pkg.version.split(".").map(Number);
patch += 1;
const newVersion = `${major}.${minor}.${patch}`;
pkg.version = newVersion;

// Write updated package.json
fs.writeFileSync(packageJsonPath, JSON.stringify(pkg, null, 2), "utf-8");

// Step 4: Save new version hash
sdkVersions[newVersion] = sri;
fs.writeFileSync(sdkVersionsPath, JSON.stringify(sdkVersions, null, 2), "utf-8");

console.log(`✔️ New SDK version bumped to v${newVersion}`);
console.log(`✔️ SRI hash saved:\n${sri}`);
