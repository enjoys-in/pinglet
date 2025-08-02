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
  pinglet_id:{
    publicKey:string
  }
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


export interface AllProjectsResponse {
  id: number;
  unique_id: string;
  name: string;
  description: null;
  logo: null;
  banner: null;
  created_at: string;
  updated_at: string;
  deleted_at: null;
  is_active: boolean;
  website: Website;
  category: Category;
}

export interface ProjectConfig {
    position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
    transition?: "fade" | "slide" | "zoom";
    branding?: {
        show: boolean;
        once: boolean;
        html: string;
    };
    sound?: {
        play: boolean;
        src: string;
        volume: number,
    };
    duration?: number;
    auto_dismiss?: boolean;
    maxVisible?: number;
    stacking?: boolean;
    dismissible?: boolean;
    pauseOnHover?: boolean;
    website?: string;  
    time?: boolean; 
    favicon?: boolean;
    theme?: {
        mode?: "light" | "dark" | "auto";
        customClass?: string;
        rounded?: boolean;
        shadow?: boolean;
        border?: boolean;
    };

    iconDefaults?: {
        show?: boolean;
        size?: number;
        position?: "left" | "right" | "top";
    };

    progressBar?: {
        show?: boolean;
        color?: string;
        height?: number;
    };
}
 