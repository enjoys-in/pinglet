export type TemplateCategory = {
  name: string
  slug: string
  description: string
  icon: string
  templates: TemplateResponse[]
}


export type TemplateVariant = {
  id: string
  name: string
  description: string
  preview?: string
}

export type TabType = "default" | "variants" | "custom"


export interface TemplateCategoryWithTemplate {
  id: number;
  name: string;
  description: string;
  templates: TemplateResponse[];
}

export interface TemplateResponse {
  id: number;
  name: string;
  description: string;
  raw_text: Rawtext;
  compiled_text: string;
  variables: Variables;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: null;
  variants: Variants
  config: TemplateConfigs
}
type Variants = Omit<TemplateResponse, 'variants'>[]

type MediaType = "image" | "video" | "audio" | "icon"
type TemplateConfigs = {
  btn1: {
    color: string;
    backgroundColor: string;
  };
  btn2: {
    color: string;
    backgroundColor: string;
  };
  text: {};
  heading: {};
  media: {
    [key in MediaType]: {
      alt: string;
      src: string;
      width: number;
    }
  },
  position: Position;
  transition: Transition;
  branding: {
    show: boolean;
    html: string;
  };
  sound: {
    play: boolean;
    src: string;
  }
  duration: number, //ms
}
type Position = "top-left" | "top-right" | "bottom-left" | "bottom-right"
type Transition = "fade" | "slide" | "zoom"
type Variables = Record<string, string>

interface Rawtext {
  css: string;
  html: string;
}