 

export interface GetAllNotificationsResponse {
  id: string
  is_active: boolean
  total_request: number
  total_sent: number
  total_clicked: number
  total_failed: number
  total_closed: number
  total_dropped: number
  created_at: string
  project: Project
}

export interface Project {
  id: number
  unique_id: string
  name: string
  website: Website
}

export interface Website {
  id: number
  domain: string
}
