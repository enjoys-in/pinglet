import { ApiPath } from "@/constants/api-path";

type RequestKey = string;
type Methods = "GET" | "POST" | "PUT" | "DELETE"
export function signal(path: ApiPath, method: Methods = "GET") {
    const key = `${method.toUpperCase()}:${path}`;
    return requestController.create(key);
}
class RequestController {
    private controllers = new Map<RequestKey, AbortController>();

    create(key: RequestKey): AbortSignal {
        this.abort(key); // optional: cancel previous request with same key
        const controller = new AbortController();
        this.controllers.set(key, controller);
        return controller.signal;
    }

    abort(key: RequestKey, reason = "Request cancelled") {
        const controller = this.controllers.get(key);
        if (controller) {
            controller.abort(reason);
            this.controllers.delete(key);
        }
    }

    abortAll(reason = "All requests cancelled") {
        for (const [key, controller] of this.controllers) {
            controller.abort(reason);
        }
        this.controllers.clear();
    }
}

export const requestController = new RequestController();
