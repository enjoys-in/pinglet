import React from 'react'
import { LogoutUser } from './server-actions/handleLogoutUser'
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'

const Userbar = () => {
    const router = useRouter()
    const handleLogoutUser = async () => {
        try {
            const isLogout = await LogoutUser()
            isLogout && router.push('/auth/login')
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className='w-full flex gap-2 px-2 items-center cursor-pointer text-muted-foreground hover:text-destructive transition-colors' onClick={handleLogoutUser}>
            <LogOut className="h-4 w-4" />
            <span className="text-sm">Logout</span>
        </div>
    )
}

export default Userbar