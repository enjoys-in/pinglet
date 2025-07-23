import { PushSubscriptionEntity } from "@/factory/entities/pushSubscription.entity";
import { InjectRepository } from "@/factory/typeorm";
import type { DeepPartial, FindManyOptions, Repository } from "typeorm";

class PushSubscriptionService {
    constructor(
        private readonly subsRepo: Repository<PushSubscriptionEntity>,
    ) {
        this.subsRepo = subsRepo;
    }

    addNewSubscription(data: DeepPartial<PushSubscriptionEntity>) {
        const newSubscription = this.subsRepo.create(data);
        return this.subsRepo.save(newSubscription);
    }
    handleSubscription(data: DeepPartial<PushSubscriptionEntity>) {
        const newSubscription = this.subsRepo.create(data);
        return this.subsRepo.upsert(newSubscription, {
            conflictPaths: ["endpoint", "project_id"],
            skipUpdateIfNoValuesChanged: true,
        });
    }

    getSubscriptionById(id: number) {
        return this.subsRepo.findOneBy({ id });
    }
    getSubscriptions(opts: FindManyOptions<PushSubscriptionEntity>) {
        return this.subsRepo.find(opts);
    }
    getSubscriptionsByProjectId(id: string) {
        return this.subsRepo.find({ where: { project_id: id } });
    }
    deleteSubscription(project_id: string, endpoint: string) {
        return this.subsRepo.delete({ project_id: project_id, endpoint });
    }
}
export const pushSubscriptionService = new PushSubscriptionService(
    InjectRepository(PushSubscriptionEntity),
);
