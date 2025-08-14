import React from 'react'
import { SidebarTrigger } from '../ui/sidebar'
import UserInfo from './userInfo'

const HeaderBar = () => {
    return (
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 sticky top-0 z-50 w-full backdrop-blur-lg transition-all duration-300   bg-background/80 shadow-sm">
            <SidebarTrigger className="-ml-1" />
            <div className="ml-auto flex items-center space-x-4">
                <UserInfo/>
               
            </div>
        </header>
    )
}

export default HeaderBar