import cors, { type CorsOptions } from "cors";
import { __CONFIG__ } from "@/app/config";

const allowedWithCreds = [
	"http://localhost:3000",
	"http://localhost:8888",
	...(__CONFIG__.APP.ALLOWED_PRIMARY_DOMAINS
		? __CONFIG__.APP.ALLOWED_PRIMARY_DOMAINS.split(",").flatMap((d) => {
			const domain = d.trim();
			if (!domain) return [];
			return [`https://${domain}`, `http://${domain}`];
		})
		: []),
];

// Combined list of all allowed request headers (dashboard + SDK)
const ALL_ALLOWED_HEADERS = [
	"Origin",
	"X-Requested-With",
	"Content-Type",
	"Accept",
	"Authorization",
	"Sessionid",
	"Access-Control-Allow-Origin",
	"x-api-key",
	"x-app-name",
	"x-app-version",
	"x-configured-domain",
	"x-pinglet-checksum",
	"x-pinglet-id",
	"x-pinglet-signature",
	"x-pinglet-version",
	"x-project-id",
	"x-signature",
	"x-timestamp",
];

export class Cors {
	/**
	 * CORS for public/SDK routes — allows ANY origin, no credentials.
	 * Used for: SSE, subscribe, templates, widget files, tracking, inbox.
	 */
	static publicOptions(): CorsOptions {
		return {
			origin: "*",
			optionsSuccessStatus: 200,
			methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
			allowedHeaders: ALL_ALLOWED_HEADERS,
			credentials: false,
		};
	}

	/**
	 * CORS for protected/dashboard routes — only allowed domains, with credentials.
	 * Used for: all JWT-protected API routes (dashboard, settings, etc.).
	 */
	static protectedOptions(): CorsOptions {
		return {
			origin: (origin, callback) => {
				if (!origin) return callback(null, true);
				if (allowedWithCreds.includes(origin)) return callback(null, origin);
				return callback(null, false);
			},
			credentials: true,
			optionsSuccessStatus: 200,
			methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
			allowedHeaders: ALL_ALLOWED_HEADERS,
		};
	}

	/** @deprecated Use publicOptions() or protectedOptions() instead */
	static options(): CorsOptions {
		return Cors.protectedOptions();
	}

	/** Allowed origins list (for reuse in static assets, socket.io, etc.) */
	static getAllowedOrigins(): string[] {
		return allowedWithCreds;
	}
}
