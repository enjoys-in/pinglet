import { Logging } from "@/logs";
import { Kafka, type Producer } from "kafkajs";
import type { NotificationEvent } from ".";

export class KafkaNotificationProducer {
	private producer: Producer;

	constructor(brokers: string[] = ["77.237.241.24:9092"]) {
		const kafka = new Kafka({ clientId: "notification-service", brokers });
		this.producer = kafka.producer();
	}

	async connect() {
		await this.producer
			.connect()
			.then(() => Logging.dev("Connected to Kafka", "notice"));
	}

	async sendEvent(topic: string, event: NotificationEvent) {
		await this.producer.send({
			topic,
			messages: [
				{
					key: event.notificationId,
					value: JSON.stringify(event),
				},
			],
		});
	}

	async disconnect() {
		await this.producer.disconnect();
	}
}
