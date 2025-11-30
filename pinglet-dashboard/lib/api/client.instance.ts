import { __config } from '@/constants/config'
import axios, { AxiosResponse } from 'axios'
import { Security } from '../security';
import { ApiResponse } from '../types';

const security = new Security();

const instance = axios.create({
    baseURL: __config.APP.BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': __config.APP.APP_ENV === "DEV" ? "http://localhost:9500" : "https://pinglet.enjoys.in",
    },
})
instance.defaults.headers["common"] = {
    "Accept": "application/json",
    "Content-Type": "application/json",
    'X-App-Version': '1.0.0',
    'X-App-Name': 'Pinglet',
    'x-api-key': __config.APP.API_KEY,
}

instance.interceptors.request.use(async (config) => {

    security.GenerateSignature((config.method as string).toUpperCase(), `${config.baseURL}${config.url}` as string, config?.data,).then((signature) => {
        config.headers['X-Signature'] = signature
    })


    return config;
}, (error) => {
    return Promise.reject(error);
});
instance.interceptors.response.use(
    async (response: AxiosResponse<ApiResponse<any>>) => {
        if (response.status === 401) {
            if (typeof window !== 'undefined') {
                window.location.href = '/login';
            }
        }
        return response;
    },
    (error) => {
        return Promise.reject(error);
    }
)
export { instance }