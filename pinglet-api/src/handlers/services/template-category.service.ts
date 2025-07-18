import { TemplateCategoryEntity } from "@/factory/entities/template-category.entity";
import { InjectRepository } from "@/factory/typeorm";
import type { DeepPartial, FindManyOptions, Repository } from "typeorm";
class TemplateCategoryService {
    constructor(

        private readonly categoryRepo: Repository<TemplateCategoryEntity>
    ) {

        this.categoryRepo = categoryRepo;
    }
    getAllActiveTemplatesCategory() {
        return this.categoryRepo.find({ where: { is_active: true } });
    }
    getAllTemplatesCategory() {
        return this.categoryRepo.find();
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
    getAllTemplatesCategoryWithTemplate() {
        return this.categoryRepo.find({ relations: ["templates"] });
    }

}
export const templateCategoryService = new TemplateCategoryService(

    InjectRepository(TemplateCategoryEntity),
);
