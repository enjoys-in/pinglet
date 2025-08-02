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
    static resetPassword(data: any) {
        return axios.get<ApiResponse<LoginResponse>>(__config.APP.BASE_URL + '/api/v1/auth/forget-password?email=' + data, {
            headers: {
                'X-App-Version': '1.0.0',
                'X-App-Name': 'Pinglet',
                'x-api-key': __config.APP.API_KEY,
                'Accept': 'application/json',
            },

        })
    }
    static handleRegister(data: any) {
        return axios.post<ApiResponse<LoginResponse>>(__config.APP.BASE_URL + '/api/v1/auth/register', data, {
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
}