// rollup.config.js
import { terser } from "rollup-plugin-terser";
import dts from "rollup-plugin-dts";
export default {
	input: "./public/scripts/v0.0.2/pinglet-sse.js",
	output: {
		file: "./public/libs/v0.0.2/pinglet-sse.js",
		format: "iife",
		name: "PingletWidget",
		sourcemap: false,
	},
	plugins: [dts({tsconfig: "./tsconfig.pinglet.json"}),
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
