type MediaData = {
    type: MediaType;
    src: string;
};
type NotificationData = {
    project_id: string;
    template_id?: string | undefined;
    variant?: string | undefined;
    title: string;
    description?: string | undefined;
    media?: MediaData | undefined;
    buttons?: {
        text: string;
        action: string;
    }[] | undefined;
};
type ShowPopup = {
    title: string;
    description?: string | undefined;
    buttons?: {
        text: string;
        onClick: (event: MouseEvent) => void;
    }[] | undefined;
    /**
     * -
     */
    icon?: string | undefined;
};
type PingletWidget = {
    version: string;
    checksum: string;
};
type TemplateData = {
    compiled_text: string;
    config: TemplateStyleConfig;
    is_active: boolean;
    /**
     * /
     * /**
     */
    is_default: boolean;
};
type Templates = {
    "": {
        [x: string]: TemplateData;
    };
};
type GlobalConfig = {
    is_tff?: string | undefined;
    templates: Templates;
    style: TemplateStyleConfig;
    config: ProjectConfig;
};
