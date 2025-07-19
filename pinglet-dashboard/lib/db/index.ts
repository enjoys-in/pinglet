import { CreatePKTableSchema, IDB } from '@enjoys/react-api/idb'
import { EntityTable } from 'dexie'
import { AllWebsitesResponse } from '../interfaces/website.interface'
import { TemplateResponse } from '../interfaces/templates.interface'
import { TemplateCategoryResponse } from '../interfaces/template-category.interface'
import { ProjectDetailsResponse } from '../interfaces/project.interface'

type Tables = {
    websites: EntityTable<AllWebsitesResponse, "id">,
    projects: EntityTable<ProjectDetailsResponse, "id">
    templates: EntityTable<TemplateResponse & { catgory_id: string}, "id">
    template_categories: EntityTable<TemplateCategoryResponse, "id">

}
const tables: CreatePKTableSchema<Tables> = {
    websites: "++id,domain",
    templates: "++id,catgory_id",
    template_categories: "++id,slug",
    projects: "++id,unique_id"
}
export const db = new IDB<Tables>(tables, "pinglet")
