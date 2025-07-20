// rollup.config.js
import { terser } from "rollup-plugin-terser";

export default {
	input: "./public/scripts/v0.0.2/main.js",
	output: {
		file: "./public/libs/pinglet-sse.js",
		format: "iife",
		name: "PingletWidget",
		sourcemap: false,
	},
	plugins: [
		terser({
			compress: {
				drop_console: true,
				drop_debugger: true,
			},
			format: {
				comments: false,
			},
		}),
	],
};
