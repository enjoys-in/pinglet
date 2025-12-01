import { TemplatesEntity } from "@/factory/entities/templates.entity";
import { InjectRepository } from "@/factory/typeorm";
import type { FindManyOptions, FindOneOptions, Repository } from "typeorm";
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
        return this.templateRepo.findOne({
            where: { id }, relations: {
                category: true
            }
        });
    }
    getTemplateByOpts(opts: FindOneOptions<TemplatesEntity>) {
        return this.templateRepo.findOne(opts);
    }
    createTemplate(data: Partial<TemplatesEntity>) {
        const i = this.templateRepo.create(data)
        return this.templateRepo.save(i);
    }
    updateTemplate(id: number, data: Partial<TemplatesEntity>) {
        const i = this.templateRepo.create(data)
        return this.templateRepo.update(id, i);
    }
    deleteTemplate(id: number) {
        return this.templateRepo.delete(id);
    }
    exists(id: number) {
        return this.templateRepo.existsBy({ id });
    }

}
export const templateService = new TemplateService(
    InjectRepository(TemplatesEntity),
);
