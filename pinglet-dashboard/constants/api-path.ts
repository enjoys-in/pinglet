export const apiPaths = {
    websites: "/api/v1/websites",
    users: "/api/v1/users",
    login: "/api/v1/auth/login",
    logout: "/api/v1/auth/logout",
} as const;


export type ApiPath = typeof apiPaths[keyof typeof apiPaths];