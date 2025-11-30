import axios from "axios";
import { instance } from "./client.instance";
import { __config } from "@/constants/config";
import { LoginResponse } from "../interfaces/auth.interface";
import { ApiResponse, UserProfileResponse } from "../types";
import { AllWebsitesResponse } from "../interfaces/website.interface";
import { signal } from "../requestController";
import { TemplateCategoryResponse } from "../interfaces/template-category.interface";
import { TemplateCategoryWithTemplate, TemplateResponse } from "../interfaces/templates.interface";
import { AllProjectsResponse } from "../interfaces/project.interface";
import { GetAllNotificationsResponse } from "../interfaces/notifications.interface";
import { WebhookResponse } from "../interfaces/webhook.interface";

const adminRoutes = (url: string) => `/api/v1/admin${url}`
const apiRoutes = (url: string) => `/api/v1/${url}`

export class API {
    static handleLogin(data: any) {

        return axios.post<ApiResponse<LoginResponse>>(__config.APP.BASE_URL + '/api/v1/auth/login', data, {
            headers: {
                'X-App-Version': '1.0.0',
                'X-App-Name': 'Pinglet',
                'x-api-key': __config.APP.API_KEY,

                'Accept': 'application/json',
                // 'Access-Control-Allow-Origin': __config.APP.APP_URL,
            },
            // withCredentials: true
        })
    }
    static resetPassword(token: string, email: string, data: any) {
        return axios.post<ApiResponse<LoginResponse>>(__config.APP.BASE_URL + '/api/v1/auth/reset-password?token=' + token + '&email=' + email, data, {
            headers: {
                'X-App-Version': '1.0.0',
                'X-App-Name': 'Pinglet',
                'x-api-key': __config.APP.API_KEY,
                'Accept': 'application/json',
            },

        })
    }
    static forgetPassword(data: any) {
        return axios.get<ApiResponse<LoginResponse>>(__config.APP.BASE_URL + '/api/v1/auth/forget-password?email=' + data, {
            headers: {
                'X-App-Version': '1.0.0',
                'X-App-Name': 'Pinglet',
                'x-api-key': __config.APP.API_KEY,
                'Accept': 'application/json',
            },

        })
    }
    static handleSignup(data: any) {
        return axios.post(__config.APP.BASE_URL + '/api/v1/auth/signup', data, {
            headers: {
                'X-App-Version': '1.0.0',
                'X-App-Name': 'Pinglet',
                'x-api-key': __config.APP.API_KEY,
                'Accept': 'application/json',
                'Access-Control-Allow-Origin': __config.APP.APP_URL,
            },
            withCredentials: true
        })
    }
    static handleLogout() {
        return instance.post('/api/v1/auth/logout', {}, {
            headers: {
                'X-App-Name': 'Pinglet',
                'x-api-key': __config.APP.API_KEY,
                'Accept': 'application/json',
                'Access-Control-Allow-Origin': __config.APP.APP_URL,
            },
            withCredentials: true
        })
    }
    static getWebsites() {
        return instance.get<ApiResponse<AllWebsitesResponse[]>>('/api/v1/websites', {
            signal: signal("/api/v1/websites")
        })
    }
    static getSingleWebsite(id: string) {
        return instance.get('/api/v1/website/' + id)
    }
    static addNewWebsite(data: any) {
        return instance.post('/api/v1/website', data)
    }
    static updateWebsite(websiteId: string, data: any) {
        return instance.put('/api/v1/website/' + websiteId, data, {
            signal: signal("/api/v1/websites", "PUT")
        })
    }
    static deleteWebsite(websiteId: string) {
        return instance.delete('/api/v1/website/' + websiteId, {
            signal: signal("/api/v1/websites", "DELETE")
        })
    }
    static getTemplateCategories() {
        return instance.get<ApiResponse<TemplateCategoryResponse[]>>('/api/v1/template-categories', {
            // signal: signal("/api/v1/template-categories", "DELETE")
        })
    }
    static demoNotification(data: any) {
        return instance.post('/api/v1/notifications/send', data)
    }
    static createProject(data: any) {
        return instance.post<ApiResponse<{ id: number }>>('/api/v1/project', data)
    }
    static deleteProject(id: string | number) {
        return instance.delete<ApiResponse<{ id: number }>>('/api/v1/project/' + id,)
    }
    static getProject(id: string | number) {
        return instance.get<ApiResponse<{ id: number }>>('/api/v1/project/' + id,)
    }
    static updateProject(id: string | number, data: any) {
        return instance.put<ApiResponse<{ id: number }>>('/api/v1/project/' + id, data)
    }
    static getAllProjects() {
        return instance.get<ApiResponse<AllProjectsResponse[]>>('/api/v1/projects')
    }
    static getTemplatesByCategory(categoryId: string) {
        return instance.get<ApiResponse<TemplateCategoryWithTemplate>>(`/api/v1/template-categories/${categoryId}/templates`, {
            // signal: signal("/api/v1/template-categories", "DELETE")
        })
    }
    static getUserProfile() {
        return instance.get<ApiResponse<UserProfileResponse>>('/api/v1/auth/profile')
    }
    static getMyNotifications(isLatest: boolean = false, limited: boolean = false) {
        return instance.get<ApiResponse<GetAllNotificationsResponse[]>>('/api/v1/my-notifications' + (isLatest ? '?latest=true' : '') + (limited ? '?limited=true' : ''))
    }
    static getMyNotification(notification_id: string | number) {
        return instance.get<ApiResponse<any>>('/api/v1/my-notification/' + notification_id)
    }
    static getMyNotificationsByProjectId(project_id: string | number) {
        return instance.get<ApiResponse<any>>('/api/v1/my-notification/' + project_id)
    }
    static getMyNotificationsLogs() {
        return instance.get<ApiResponse<any>>('/api/v1/my-notification/logs')
    }
    static getMyNotificationsLogById(logs_id: string | number) {
        return instance.get<ApiResponse<any>>('/api/v1/my-notification/logs' + logs_id)
    }

    static getWidgets() {
        return instance.get<ApiResponse<any>>('/api/v1/widgets')
    }
    static createWidget(data: any) {
        return instance.post<ApiResponse<any>>('/api/v1/widget', data)
    }
    static updateWidget(widget_id: string, data: any) {
        return instance.put<ApiResponse<any>>('/api/v1/widget/' + widget_id, data)
    }
    static deleteWidget(widget_id: string) {
        return instance.delete<ApiResponse<any>>('/api/v1/widget/' + widget_id)
    }
    static getWidgetById(widget_id: string) {
        return instance.get<ApiResponse<any>>('/api/v1/widget/' + widget_id)
    }

    // Webhooks
    static getAllWebhooks() {
        return instance.get<ApiResponse<WebhookResponse[]>>('/api/v1/webhooks')
    }
    static getWebhookById(webhook_id: string | number) {
        return instance.get<ApiResponse<any>>('/api/v1/webhook/' + webhook_id)
    }
    static getWebhooksByProjectId(project_id: string | number) {
        return instance.get<ApiResponse<any>>('/api/v1/webhooks/project/' + project_id)
    }
    static createWebhook(data: any) {
        return instance.post<ApiResponse<{ id: number }>>('/api/v1/webhook', data)
    }
    static updateWebhook(webhook_id: string | number, data: any) {
        return instance.put<ApiResponse<{ id: number }>>('/api/v1/webhook/' + webhook_id, data)
    }
    static deleteWebhook(webhook_id: string | number) {
        return instance.delete<ApiResponse<any>>('/api/v1/webhook/' + webhook_id)
    }

    static createTemplate(data: any) {
        return instance.post<ApiResponse<{ id: number }>>('/api/v1/template', data)
    }
    static updateTemplate(template_id: string | number, data: any) {
        return instance.put<ApiResponse<{ id: number }>>('/api/v1/template/' + template_id, data)
    }
    static deleteTemplate(template_id: string | number) {
        return instance.delete<ApiResponse<any>>('/api/v1/template/' + template_id)
    }
    static getTemplateById(template_id: string | number) {
        return instance.get<ApiResponse<any>>('/api/v1/template/' + template_id)
    }
}