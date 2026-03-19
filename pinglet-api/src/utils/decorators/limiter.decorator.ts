import { HttpException } from "@enjoys/exception";
import { type Options, rateLimit } from "express-rate-limit";
function ThrottleException(
	message: Record<string, any> = {
		path: "/",
		info: "Request Throttled",
		solution: "Try Again after time",
	},
): void {
	new HttpException({
		name: "TOO_MANY_REQUESTS",
		message: "Current Rate Limit is Exceeded",
		stack: message,
	});
}
// Interface for rate limit options
type RateLimitOptions = Omit<Partial<Options>, "handler">;
export function UseLimiter(limit?: number | "noLimit", timeout = 0): Function {
	return (target: any, key: any, descriptor: PropertyDescriptor) => {
		if (limit === "noLimit") limit = 60;
		if (timeout === 0) timeout = 1;
		const options = {
			windowMs: timeout * 60 * 1000, // minutes
			max: typeof limit === "number" ? limit : 5,
			handler: ThrottleException,
		};
		descriptor.value = rateLimit(options);
		return descriptor;
	};
}
