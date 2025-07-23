/**
 * Create a notification permission dialog to ask users to allow notifications.
 * @param {{title: string, description: string, site: string, onAllow: () => void, onDeny: () => void}} options
 * @returns {HTMLDivElement} The dialog element.
 */
export function createNotificationPermissionDialog(options?: {
    title: string;
    description: string;
    site: string;
    onAllow: () => void;
    onDeny: () => void;
}): HTMLDivElement;
export function askNotificationPermissionFunction(endpoint: any, projectId: any): void;
export function TriggerBrowserNotificationApi(title: any, body: any, icon: any): () => void;
