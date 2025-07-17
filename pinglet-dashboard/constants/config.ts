import { z } from 'zod'

const envSchema = z.object({
    BASE_URL: z.string().url(),
    GQL_URL: z.string().url(),
    APP_ENV: z.string().url(),
    APP_URL: z.string().url(),
})
const APP_ENV = process.env.NEXT_PUBLIC_APP_ENV ?? "DEV"
const config = {
    ENCRYPTION_KEY: process.env.NEXT_PUBLIC_ENCRYPTION_KEY,
    APP: {
        APP_URL: APP_ENV === "DEV" ? "http://localhost:3000" : "https://pinglet.enjoys.in",
        BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
        API_URL: process.env.NEXT_PUBLIC_APP_URL + "/api/v1",
        APP_SECRET: process.env.NEXT_PUBLIC_APP_SECRET,
        APP_ENV: process.env.NEXT_PUBLIC_APP_ENV,
        API_KEY: process.env.NEXT_PUBLIC_API_KEY,
    }
}
const envParsed = envSchema.safeParse(config.APP)


export const __config = Object.freeze(config)