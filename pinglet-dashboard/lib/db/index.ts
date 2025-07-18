import { CreatePKTableSchema, IDB } from '@enjoys/react-api/idb'
import { EntityTable } from 'dexie'
import { AllWebsitesResponse } from '../interfaces/website.interface'
import { TemplateResponse } from '../interfaces/templates.interface'
import { TemplateCategoryResponse } from '../interfaces/template-category.interface'
import { ProjectDetailsResponse } from '../interfaces/project.interface'

type Tables = {
    websites: EntityTable<AllWebsitesResponse, "domain">,
    projects: EntityTable<ProjectDetailsResponse,"unique_id">
    templates: EntityTable<TemplateResponse,"slug">
    template_categories: EntityTable<TemplateCategoryResponse,"slug">

}
const tables: CreatePKTableSchema<Tables> = {
    websites: "++domain,id",
    templates: "++slug,id",
    template_categories: "++slug,id",
    projects: "++unique_id,id"
}
export const db = new IDB<Tables>(tables, "pinglet")
