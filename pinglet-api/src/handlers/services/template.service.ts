import { TemplatesEntity } from "@/factory/entities/templates.entity";
import { InjectRepository } from "@/factory/typeorm";
import type { FindManyOptions, Repository } from "typeorm";
class TemplateService {
    constructor(
        private readonly templateRepo: Repository<TemplatesEntity>,

    ) {
        this.templateRepo = templateRepo;

    }
    getAllTemplates(opts?: FindManyOptions<TemplatesEntity>) {
        return this.templateRepo.find(opts);
    }
    getAllTemplatesByCategory(id: number) {
        return this.templateRepo.find({ where: { category: { id } } });
    }
    getTemplateById(id: number) {
        return this.templateRepo.findOne({ where: { id } });
    }
    createTemplate(data: Partial<TemplatesEntity>) {
        return this.templateRepo.save(data);
    }
    updateTemplate(id: number, data: Partial<TemplatesEntity>) {
        return this.templateRepo.update(id, data);
    }
    deleteTemplate(id: number) {
        return this.templateRepo.delete(id);
    }

}
export const templateService = new TemplateService(
    InjectRepository(TemplatesEntity),
);
