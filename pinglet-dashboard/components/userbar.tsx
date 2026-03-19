import React from 'react'
import { Button } from './ui/button'
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
        <div className='w-full'>
            <Button
                variant="ghost"
                onClick={handleLogoutUser}
                className="flex gap-2 px-2 items-center w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
            >
                <LogOut className="h-4 w-4" />
                <span className="text-sm">Logout</span>
            </Button>
        </div>
    )
}

export default Userbar