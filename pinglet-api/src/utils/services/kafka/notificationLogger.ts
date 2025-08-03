
import { KafkaNotificationProducer } from "./producer";
import { NotificationEvent } from ".";

export interface NotificationLogger {
  log(event: NotificationEvent): Promise<void>;
}

export class KafkaNotificationLogger implements NotificationLogger {
  constructor(private producer: KafkaNotificationProducer, private topic: string) { }

  async log(event: NotificationEvent): Promise<void> {
    return this.producer.sendEvent(this.topic, event);
  }
}


