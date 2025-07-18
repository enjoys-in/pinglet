export interface TemplateResponse {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    deleted_at: any;
}
export type TemplateCategory = {
  name: string
  slug: string
  description: string
  icon: string
  templates: Template[]
}

export type Template = {
  id: string
  name: string
  description: string
  media?: {
    type: "image" | "video" | "icon"
    url: string
    alt?: string
  }
  variants?: TemplateVariant[]
  customCode?: {
    html?: string
    css?: string
    js?: string
  }
}

export type TemplateVariant = {
  id: string
  name: string
  description: string
  preview?: string
}

export type TabType = "default" | "variants" | "custom"
