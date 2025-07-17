import { WebhookEntity } from "@/factory/entities/webhook.entity";
import { InjectRepository } from "@/factory/typeorm";
import type { DeepPartial, FindManyOptions, Repository } from "typeorm";
class WebhookService {
	constructor(private readonly webhookRepo: Repository<WebhookEntity>) {
		this.webhookRepo = webhookRepo;
	}
	createNewWebhook(webhook: DeepPartial<WebhookEntity>) {
		const newWebhook = this.webhookRepo.create(webhook);
		return this.webhookRepo.save(newWebhook);
	}
	getAllWebhooks(opts?: FindManyOptions<WebhookEntity>) {
		return this.webhookRepo.find(opts);
	}
	getWebhookById(id: number) {
		return this.webhookRepo.findOneBy({ id });
	}
	getWebhooksByProjectId(id: string) {
		return this.webhookRepo.find({ where: { project_id: id } });
	}
	updateWebhook(id: number, data: DeepPartial<WebhookEntity>) {
		return this.webhookRepo.update(id, data);
	}
	deleteWebhook(id: number) {
		return this.webhookRepo.softDelete(id);
	}
}

export const webhookService = new WebhookService(
	InjectRepository(WebhookEntity),
);
