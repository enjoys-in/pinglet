export interface ProjectDetailsResponse {
  id: number;
  name: string;
  unique_id: string;
  description: null;
  logo: null;
  banner: null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  is_active: boolean;
  website: Website;
  webhooks: any[];
  category: Category;
}


interface Website {
  id: number;
  name: string;
  tags: Array<string>;
  domain: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}


interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: null;
  templates: any[];
}

