type MediaType = "image" | "video" | "audio" | "icon" | "logo" | "iframe";
type CommonStyle = {
    color?: string | undefined;
    backgroundColor?: string | undefined;
    fontSize?: string | undefined;
    fontWeight?: string | undefined;
    borderRadius?: string | undefined;
    padding?: string | undefined;
    margin?: string | undefined;
    border?: string | undefined;
    boxShadow?: string | undefined;
    textAlign?: "center" | "right" | "left" | undefined;
    fontFamily?: string | undefined;
    lineHeight?: string | undefined;
    width?: string | number | undefined;
    height?: string | number | undefined;
};
type ButtonStyle = CommonStyle;
type TextStyle = CommonStyle;
type MediaStyle = {
    objectFit?: "cover" | "contain" | undefined;
    color?: string | undefined;
    backgroundColor?: string | undefined;
    fontSize?: string | undefined;
    fontWeight?: string | undefined;
    borderRadius?: string | undefined;
    padding?: string | undefined;
    margin?: string | undefined;
    border?: string | undefined;
    boxShadow?: string | undefined;
    textAlign?: "center" | "right" | "left" | undefined;
    fontFamily?: string | undefined;
    lineHeight?: string | undefined;
    width?: string | number | undefined;
    height?: string | number | undefined;
};
type MediaStyleMapStrict = {
    image?: MediaStyle | undefined;
    video?: MediaStyle | undefined;
    audio?: MediaStyle | undefined;
    icon?: MediaStyle | undefined;
    logo?: MediaStyle | undefined;
    iframe?: MediaStyle | undefined;
};
type MediaStyleMap = any;
type MediaControls = {
    autoplay: boolean;
    muted: boolean;
    loop: boolean;
    controls: boolean;
};
type TemplateStyleConfig = {
    btn1?: CommonStyle | undefined;
    btn2?: CommonStyle | undefined;
    title?: CommonStyle | undefined;
    description?: CommonStyle | undefined;
    media?: any;
    duration?: number | undefined;
    controls?: {
        audio?: MediaControls;
        video?: MediaControls;
    } | undefined;
};
