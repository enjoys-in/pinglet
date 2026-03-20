export interface WidgetProps {
	text: string;
	description: string;
	buttonText: string;
	link: string;
	imagePreview: string;
}
export interface WidgetConfig {
  position: string;
  autoDismiss: boolean;
  autoDismissSeconds: number;
  autoShow: boolean;
  autoShowDelaySeconds: number;
  showCloseButton: boolean;
  backdrop: boolean;
  sound: boolean;
  animation: string;
  maxWidth: number;
  zIndex: number;
}