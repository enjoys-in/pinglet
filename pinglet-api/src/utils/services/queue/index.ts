import type { ConnectionOptions, Job, JobsOptions } from "bullmq";
import { Queue as BullMQQueue, Worker as BullMQWorker } from "bullmq";
import { QUEUE_JOBS, QUEUE_NAME } from "./name";
const __CONFIG__ = {
	CACHE_ENBALED: String(process.env.CACHE_ENBALED),
	CACHE_HOST: String(process.env.CACHE_HOST),
	CACHE_PORT: Number(process.env.CACHE_PORT) || 6379,
};
export class QueueService {
	private static readonly queues: Map<string, BullMQQueue> = new Map();
	static connection: ConnectionOptions = {
		url: `${__CONFIG__.CACHE_HOST}:${__CONFIG__.CACHE_PORT}`,
	};
	public static createQueue(name: keyof typeof QUEUE_NAME): BullMQQueue {
		if (!QueueService.queues.has(QUEUE_NAME[name])) {
			const queue = new BullMQQueue(QUEUE_NAME[name], {
				connection: QueueService.connection,
			});
			QueueService.queues.set(QUEUE_NAME[name], queue);
		}
		const existingQueue = QueueService.queues.get(QUEUE_NAME[name]);
		if (!existingQueue) {
			throw new Error(`Queue ${QUEUE_NAME[name]} not found`);
		}
		return existingQueue;
	}

	static async addJob(
		queueName: keyof typeof QUEUE_NAME,
		jobName: keyof typeof QUEUE_JOBS,
		data: unknown,
		opts?: JobsOptions,
	): Promise<void> {
		const queue = new BullMQQueue(QUEUE_NAME[queueName], {
			connection: QueueService.connection,
		});
		await queue.add(QUEUE_JOBS[jobName], data, opts);
	}

	static createWorker(
		queueName: keyof typeof QUEUE_NAME,
		processor: (job: Job) => Promise<void>,
	): BullMQWorker {
		return new BullMQWorker(QUEUE_NAME[queueName], processor, {
			connection: QueueService.connection,
		});
	}
}
