type BrandingStyle = CommonStyle;
type Branding = {
    show: boolean;
    html?: string | undefined;
    style?: CommonStyle | undefined;
};
type ProjectConfig = {
    position?: "bottom-left" | "top-right" | "top-left" | "bottom-right" | undefined;
    transition?: "fade" | "slide" | "zoom" | undefined;
    branding?: {
        show: boolean;
        html: string;
    } | undefined;
    sound?: {
        play: boolean;
        src: string;
        volume: number;
    } | undefined;
    duration?: number | undefined;
    auto_dismiss?: boolean | undefined;
    maxVisible?: number | undefined;
    stacking?: boolean | undefined;
    dismissible?: boolean | undefined;
    pauseOnHover?: boolean | undefined;
    website?: string | undefined;
    time?: boolean | undefined;
    favicon?: boolean | undefined;
    theme?: {
        mode?: "light" | "dark" | "auto";
        customClass?: string;
        rounded?: boolean;
        shadow?: boolean;
        border?: boolean;
    } | undefined;
    iconDefaults?: {
        show?: boolean;
        size?: number;
        position?: "left" | "right" | "top";
    } | undefined;
    progressBar?: {
        show?: boolean;
        color?: string;
        height?: number;
    } | undefined;
};
