export interface Widget {
    id: number | string
    widget_id: string
    data: Record<string, any>|any
    project_id: number
    is_active: boolean
    created_at: string
    updated_at: string
    deleted_at: null | string
}
export type AllWidgetResponse = Array<Widget>