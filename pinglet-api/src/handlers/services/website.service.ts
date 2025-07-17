import { WebsiteEntity } from "@/factory/entities/website.entity";
import { InjectRepository } from "@/factory/typeorm";
import type { DeepPartial, FindManyOptions, Repository } from "typeorm";
class WebsiteService {
	constructor(private readonly websiteRepo: Repository<WebsiteEntity>) {
		this.websiteRepo = websiteRepo;
	}
	createNewWebsite(website: DeepPartial<WebsiteEntity>) {
		const newWebsite = this.websiteRepo.create(website);
		return this.websiteRepo.save(newWebsite);
	}
	getAllWebsites(opts?: FindManyOptions<WebsiteEntity>) {
		return this.websiteRepo.find(opts);
	}
	getWebsiteById(id: number) {
		return this.websiteRepo.findOneBy({ id });
	}
	getWebsitesByUserId(id: number) {
		return this.websiteRepo.find({ where: { user: { id: id } } });
	}
	getWebsitesByDomain(domain: string) {
		return this.websiteRepo.findOneBy({ domain });
	}
	updateWebsite(id: number, data: DeepPartial<WebsiteEntity>) {
		return this.websiteRepo.update(id, data);
	}
	deleteWebsite(id: number) {
		return this.websiteRepo.softDelete(id);
	}
}

export const websiteService = new WebsiteService(
	InjectRepository(WebsiteEntity),
);
