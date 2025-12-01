export interface TemplateCategoryResponse {
  id: number
  name: string
  description: string
  slug: string
  template_count: string
}

export interface TemplateCategory {
  id: number,
  name: string,
  slug: string,
  description: string,
  is_active: boolean,
  created_at: string,
  updated_at: string,
  deleted_at: null
}