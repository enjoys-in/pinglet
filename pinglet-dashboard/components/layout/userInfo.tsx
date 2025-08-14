"use client"
import React, { useLayoutEffect } from 'react'
import { Skeleton } from '../ui/skeleton'
import { API } from '@/lib/api/handler'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const UserInfo = () => {
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
               <DropdownMenu>
              
              <DropdownMenuTrigger asChild>
               
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                {/* <DropdownMenuItem>
                  <span>Account</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Billing</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Sign out</span>
                </DropdownMenuItem> */}
              </DropdownMenuContent>
            </DropdownMenu>
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

export default UserInfo