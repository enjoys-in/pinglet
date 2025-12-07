type MediaType = "image" | "video" | "audio" | "icon" | "logo" | "iframe";

export interface TemplateConfig {
	btn1?: ButtonStyle;
	btn2?: ButtonStyle;
	title?: TextStyle;
	description?: TextStyle;
	media?: {
		[key in MediaType]?: MediaStyle;
	};
	duration?: number;
	controls?: {
		[key in "audio" | "video"]?: MediaControls;
	};
}
interface MediaControls {
	autoplay: boolean;
	muted: boolean;
	loop: boolean;
	controls: boolean;
}
interface ButtonStyle extends CommonStyle {}

interface TextStyle extends CommonStyle {}

interface MediaStyle extends CommonStyle {
	objectFit?: "contain" | "cover";
}

export interface CommonStyle {
	color?: string;
	backgroundColor?: string;
	fontSize?: string;
	fontWeight?: string;
	borderRadius?: string;
	padding?: string;
	margin?: string;
	border?: string;
	boxShadow?: string;
	textAlign?: "left" | "center" | "right";
	fontFamily?: string;
	lineHeight?: string;
	width?: string | number;
	height?: string | number;
}
