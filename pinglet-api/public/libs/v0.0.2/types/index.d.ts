type MediaData = {
    type: MediaType;
    src: string;
};
type NotificationDataBody = {
    variant?: string | undefined;
    title: string;
    description?: string | undefined;
    media?: MediaData | undefined;
    buttons?: {
        text: string;
        action: string;
    }[] | undefined;
    actions?: {
        action: string;
        title: string;
    }[] | undefined;
};
type NotificationData = {
    project_id: string;
    template_id?: string | undefined;
    tag: string;
    /**
     * // -1, 0, 1 default is 0
     */
    type: 1 | 0 | -1;
    body?: NotificationDataBody | undefined;
    overrides?: Object | undefined;
    data?: Object | undefined;
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
