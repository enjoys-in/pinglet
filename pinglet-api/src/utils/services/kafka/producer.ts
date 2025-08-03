import { Kafka, Producer } from "kafkajs";
import { NotificationEvent } from ".";
import { Logging } from "@/logs";

export class KafkaNotificationProducer {
    private producer: Producer;

    constructor(brokers: string[]=["185.193.19.118:9092"]) {
        const kafka = new Kafka({ clientId: "notification-service", brokers });
        this.producer = kafka.producer();
    }

    async connect() {
        await this.producer.connect().then(() => Logging.dev("Connected to Kafka","notice"));
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
