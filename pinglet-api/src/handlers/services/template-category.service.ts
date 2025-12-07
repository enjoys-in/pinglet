import { TemplateCategoryEntity } from "@/factory/entities/template-category.entity";
import { InjectRepository } from "@/factory/typeorm";
import type {
	DeepPartial,
	FindManyOptions,
	FindOneOptions,
	Repository,
} from "typeorm";
class TemplateCategoryService {
	constructor(
		private readonly categoryRepo: Repository<TemplateCategoryEntity>,
	) {
		this.categoryRepo = categoryRepo;
	}
	getAllActiveTemplatesCategory() {
		return this.categoryRepo.find({ where: { is_active: true } });
	}
	getAllTemplatesCategory(opts?: FindManyOptions<TemplateCategoryEntity>) {
		return this.categoryRepo.find(opts);
	}
	getAllTemplatesCategoryWithTemplatesCount() {
		return this.categoryRepo.query(`
             SELECT
                    c.id,
                    c.name,
                    c.description,
                    c.slug,
                    COUNT(t.id) AS template_count
                FROM
                    template_category c
                LEFT JOIN
                templates t ON t.category_id = c.id
                WHERE
                    c.is_active = true
                GROUP BY
                    c.id, c.name, c.slug
                ORDER BY
                   c.id ASC;
            `);
	}

	getTemplateCategoryWithTemplatesById(
		opts: FindOneOptions<TemplateCategoryEntity>,
	) {
		return this.categoryRepo.findOne(opts);
	}
	getTemplateCategoryById(id: number) {
		return this.categoryRepo.findOne({ where: { id } });
	}
}
export const templateCategoryService = new TemplateCategoryService(
	InjectRepository(TemplateCategoryEntity),
);
