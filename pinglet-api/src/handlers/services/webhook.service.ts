import { WebhookEntity, type WebhookEvent } from "@/factory/entities/webhook.entity";
import { InjectRepository } from "@/factory/typeorm";
import type { DeepPartial, FindManyOptions, Repository } from "typeorm";
class WebhookService {
	constructor(private readonly webhookRepo: Repository<WebhookEntity>) {
		this.webhookRepo = webhookRepo;
	}
	createNewWebhook(webhook: Partial<WebhookEntity>) {
		const newWebhook = this.webhookRepo.create(webhook);
		return this.webhookRepo.save(newWebhook);
	}
	getAllWebhooks(opts?: FindManyOptions<WebhookEntity>) {
		return this.webhookRepo.find(opts);
	}
	getWebhookById(id: number) {
		return this.webhookRepo.findOneBy({ id });
	}
	getWebhooksByUserId(id: number) {
		return this.webhookRepo.find({ where: { user_id: id } });
	}
	updateWebhook(id: number, data: DeepPartial<WebhookEntity>) {
		return this.webhookRepo.update(id, data);
	}
	deleteWebhook(id: number) {
		return this.webhookRepo.softDelete(id);
	}
	getWebhooksByEvent(userId: number, event: WebhookEvent) {
		return this.webhookRepo
			.createQueryBuilder("webhook")
			.where("webhook.user_id = :userId", { userId })
			.andWhere("webhook.is_active = true")
			.andWhere(":event = ANY(webhook.triggers_on)", { event })
			.getMany();
	}
	async recordSuccess(id: number) {
		await this.webhookRepo
			.createQueryBuilder()
			.update(WebhookEntity)
			.set({
				success_count: () => "success_count + 1",
				last_triggered_at: new Date(),
			})
			.where("id = :id", { id })
			.execute();
	}
	async recordFailure(id: number) {
		await this.webhookRepo
			.createQueryBuilder()
			.update(WebhookEntity)
			.set({
				failure_count: () => "failure_count + 1",
				last_triggered_at: new Date(),
			})
			.where("id = :id", { id })
			.execute();
	}
}

export const webhookService = new WebhookService(
	InjectRepository(WebhookEntity),
);
