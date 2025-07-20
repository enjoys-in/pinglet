// rollup.config.js
import { terser } from "rollup-plugin-terser";

export default {
	input: "./public/scripts/v0.0.2/pinglet-sse.js",
	output: {
		file: "./public/libs/v0.0.2/pinglet-sse.js",
		format: "iife",
		name: "PingletWidget",
		sourcemap: false,
	},
	plugins: [
		terser({
			compress: {
				drop_console: false,
				drop_debugger: true,
			},
			format: {
				comments: false,
			},
		}),
	],
};
