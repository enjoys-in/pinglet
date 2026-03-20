import { __CONFIG__ } from "@/app/config";
import { Logging } from "@/logs";
import type { NotificationEvent } from "@/utils/services/kafka";
import { Cache } from "@/utils/services/redis/cacheService";
import { REDIS_KEYS_NAME } from "@/utils/services/redis/name";
import { Kafka, logLevel } from "kafkajs";
export class KafkaAnalyticsConsumer {
	private kafka = new Kafka({
		clientId: "analytics-consumer",
		brokers: [`${__CONFIG__.KAFKA.KAFKA_HOST}:${__CONFIG__.KAFKA.KAFKA_PORT}`],
		retry: {
			initialRetryTime: 100,
			retries: 3,
		},
	});
	private consumer = this.kafka.consumer({
		groupId: "analytics-group",
		sessionTimeout: 30000,
		heartbeatInterval: 3000,
	});
	private retryCount = 0;
	private readonly maxRetries = 10;

	async start() {
		try {
			await this.consumer.connect();
			Logging.dev("Connected to Kafka Consumer", "notice");
			this.retryCount = 0;

			await this.consumer.subscribe({
				topic: "notification-events",
				fromBeginning: false,
			});
			Logging.dev("Subscribed to Consumer topic", "info");

			await this.consumer.run({
				eachMessage: async ({ topic, partition, message }) => {
					try {
						const raw = message.value?.toString();
						if (!raw) {
							Logging.dev(`[KafkaConsumer] empty message on ${topic}:${partition}`, "alert");
							return;
						}

						const data = JSON.parse(raw) as NotificationEvent;
						const { projectId, event } = data;

						if (!projectId || !event) {
							Logging.dev(`[KafkaConsumer] skipped — missing projectId=${projectId} event=${event}`, "error");
							return;
						}

						Logging.dev(`[KafkaConsumer] ${event} project=${projectId}`);

						const counterKey = REDIS_KEYS_NAME.ANALYTICS_DELTA.replace(
							"projectId",
							projectId,
						);
						const bufferKey = REDIS_KEYS_NAME.ANALYTICS_BUFFER.replace(
							"projectId",
							projectId,
						);

						await Cache.cache.hIncrBy(counterKey, event, 1);
						await Cache.cache.rPush(bufferKey, raw);
					} catch (err: any) {
						Logging.dev(`[KafkaConsumer] eachMessage error: ${err?.message || err}`, "error");
					}
				},
			});
		} catch (error) {
			console.error("Kafka consumer error:", error);
			if (this.retryCount < this.maxRetries) {
				const delay = Math.min(1000 * 2 ** this.retryCount, 60000);
				this.retryCount++;
				setTimeout(() => this.start(), delay);
			} else {
				console.error("Kafka consumer max retries reached, giving up.");
			}
		}
	}
}
