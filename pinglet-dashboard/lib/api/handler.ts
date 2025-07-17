import axios from "axios";
import { instance } from "./client.instance";
import { __config } from "@/constants/config";
import { LoginResponse } from "../interfaces/auth.interface";
import { ApiResponse } from "../types";

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
}