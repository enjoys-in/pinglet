
import axios from "axios";
import { ApiResponse } from ".";

declare module axios {
    export interface AxiosResponse<T = any,> {
        data: ApiResponse<T>;
    }
}