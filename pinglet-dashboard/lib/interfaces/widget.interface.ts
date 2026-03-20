export interface WidgetConfig {
    position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'center'
    autoDismiss: boolean
    autoDismissSeconds: number
    autoShow: boolean
    autoShowDelaySeconds: number
    showCloseButton: boolean
    backdrop: boolean
    sound: boolean
    animation: 'slide' | 'fade' | 'bounce' | 'none'
    maxWidth: number
    zIndex: number
}

export const defaultWidgetConfig: WidgetConfig = {
    position: 'bottom-right',
    autoDismiss: false,
    autoDismissSeconds: 5,
    autoShow: true,
    autoShowDelaySeconds: 0,
    showCloseButton: true,
    backdrop: false,
    sound: false,
    animation: 'slide',
    maxWidth: 320,
    zIndex: 9999,
}

export interface Widget {
    id: number | string
    widget_id: string
    data: Record<string, any>|any
    config: WidgetConfig | null
    project_id: number
    is_active: boolean
    created_at: string
    updated_at: string
    deleted_at: null | string
}
export type AllWidgetResponse = Array<Widget>