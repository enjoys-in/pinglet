"use server"
import { cookies } from "next/headers"
export const LogoutUser = async () => {
    try {
        (await cookies()).delete('access_token')
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}
