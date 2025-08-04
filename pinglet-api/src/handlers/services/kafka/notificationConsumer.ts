import { __CONFIG__ } from '@/app/config';
import { Logging } from '@/logs';
import { NotificationEvent } from '@/utils/services/kafka';
import { Cache } from '@/utils/services/redis/cacheService';
import { REDIS_KEYS_NAME } from '@/utils/services/redis/name';
import { Kafka } from 'kafkajs';
export class KafkaAnalyticsConsumer {
  private kafka = new Kafka({
    clientId: 'analytics-consumer',
    brokers: [`${__CONFIG__.KAFKA.KAFKA_HOST}:${__CONFIG__.KAFKA.KAFKA_PORT}`],
    retry: {
      initialRetryTime: 100,
      retries: 8
    }
  });
  private consumer = this.kafka.consumer({
    groupId: 'analytics-group',
    sessionTimeout: 30000,
    heartbeatInterval: 3000,
  });

  async start() {
    try {
      await this.consumer.connect();
      Logging.dev('Connected to Kafka Consumer', "notice");

      await this.consumer.subscribe({ topic: 'notification-events', fromBeginning: false });
      Logging.dev('Subscribed to Consumer topic', "info");

      await this.consumer.run({
        eachMessage: async ({ message }) => {
          const data = JSON.parse(message.value!.toString()) as NotificationEvent;
          const { projectId, event } = data;
        
          const redisKey = `analytics:${projectId}:${event}`; // e.g., analytics:proj123:click
          await Cache.cache.incr(redisKey);
          const counterKey = REDIS_KEYS_NAME.ANALYTICS_DELTA.replace('projectId', projectId);
          const bufferKey = REDIS_KEYS_NAME.ANALYTICS_BUFFER.replace('projectId', projectId);

          await Cache.cache.hIncrBy(counterKey, event, 1);
          await Cache.cache.rPush(bufferKey, message.value!.toString());
        },
      });
    } catch (error) {
      console.error('Kafka consumer error:', error);
      // Retry after delay
      setTimeout(() => this.start(), 5000);
    }
  }
}