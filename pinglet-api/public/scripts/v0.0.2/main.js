import { defaultStyles } from "./style.js";
import { createVariant } from "./variants.js";
// src/main.js
import { initWidget, renderToast } from "./widget.js";

const PingletWidget = {
	async init({ endpoint, domain, projectId, pingletId }) {
		const response = await fetch(
			`${endpoint}/load/${projectId}?domain=${domain}`,
		);
		const config = await response.json();
		if (!config || !config.success) return;

		const globalConfig = {
			...config.globalConfig,
			style: {
				...defaultStyles,
				...config.globalConfig?.style,
			},
		};

		initWidget(globalConfig);
		const socket = new EventSource(
			`${endpoint}/notifications/sse?projectId=${projectId}&pingletId=${pingletId}`,
		);
		socket.onmessage = (e) => {
			const data = JSON.parse(e.data);
			const variantEl = createVariant(data, globalConfig.style);
			renderToast(variantEl, globalConfig);
		};
	},
};

export { PingletWidget };
