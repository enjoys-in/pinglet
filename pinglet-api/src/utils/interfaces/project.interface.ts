import type { CommonStyle } from "./template.interface";
interface BrandingStyle extends CommonStyle {}
export interface Branding {
	show: boolean;
	html?: string;
	once: boolean;
	style?: BrandingStyle;
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
		volume: number;
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
