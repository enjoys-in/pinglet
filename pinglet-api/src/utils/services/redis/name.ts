export enum REDIS_KEYS_NAME {
	ANALYTICS_DELTA = "analytics:delta:projectId",
	ANALYTICS_BUFFER = "analytics:buffer:projectId",
	ANALYTICS_RETRY_DELTA = "failed:analytics:delta:keys",
	ANALYTICS_RETRY_BUFFER = "failed:analytics:buffer:keys",
}
