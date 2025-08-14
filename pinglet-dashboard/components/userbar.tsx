import React from 'react'
import { Button } from './ui/button'
import { LogoutUser } from './server-actions/handleLogoutUser'
import { useRouter } from 'next/navigation'

const Userbar = () => {
    const router = useRouter()
    const handleLogoutUser = async () => {
        try {

            const isLogout = await LogoutUser()
            isLogout && router.push('/auth/login')
        } catch (error) {


        }
    }

    return (
        <div className='w-full'>
            <Button variant="outline" onClick={handleLogoutUser} className="flex gap-2 px-2 items-center w-full">
                Logout
            </Button>
        </div>
    )
}

export default Userbar