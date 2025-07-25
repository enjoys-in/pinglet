"use client"
import { API } from '@/lib/api/handler'
import { ChevronUp, User2 } from 'lucide-react'
import React, { use, useLayoutEffect } from 'react'
import { Skeleton } from './ui/skeleton'

const Userbar = () => {
    const [user, setUser] = React.useState<{ name?: string, email: string } | null>(null)
    const [loading, setLoading] = React.useState<boolean>(true)
    const fetchUser = async () => {
        try {
            const response = await API.getUserProfile()
            setUser(response.data.result)
            setLoading(false)
        } catch (error) {
            console.error(error)
        }
    }
    useLayoutEffect(() => {
        fetchUser()
    }, [])
    return (
        <div>
            {
                loading ? <Skeleton className="h-4 flex gap-2 px-2 items-center w-48" /> : (<>
                    {/* <User2 className="h-4 w-4" /> */}
                    <div className="grid flex-1 text-left text-sm leading-tight">
                        {user?.name && <span className="truncate font-semibold">{user?.name}</span>}
                        <span className="truncate text-xs">{user?.email}</span>
                    </div>
                    {/* <ChevronUp className="ml-auto size-4" /> */}
                </>)
            }

        </div>
    )
}

export default Userbar