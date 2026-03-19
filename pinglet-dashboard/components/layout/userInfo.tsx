"use client"
import React, { useLayoutEffect } from 'react'
import { Skeleton } from '../ui/skeleton'
import { API } from '@/lib/api/handler'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAuthStore } from '@/store/auth.store'
import { Avatar, AvatarFallback } from '../ui/avatar'
import { LogOut, Settings, User } from 'lucide-react'
import { LogoutUser } from '../server-actions/handleLogoutUser'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const UserInfo = () => {
  const { user, setUser } = useAuthStore()
  const router = useRouter()

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

  const handleLogout = async () => {
    try {
      const isLogout = await LogoutUser()
      if (isLogout) router.push('/auth/login')
    } catch (error) {
      console.error(error)
    }
  }

  const getInitials = (email?: string) => {
    if (!email) return "?"
    return email.charAt(0).toUpperCase()
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <Skeleton className="h-7 w-7 rounded-full" />
        <Skeleton className="h-3 w-24 hidden lg:block" />
      </div>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-muted/60 transition-colors outline-none">
          <Avatar className="h-7 w-7 border border-border/50">
            <AvatarFallback className="text-xs font-medium bg-primary/10 text-primary">
              {getInitials(user?.email)}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs text-muted-foreground hidden lg:block max-w-[140px] truncate">{user?.email}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56 rounded-xl shadow-lg border-border/50"
        side="bottom"
        align="end"
        sideOffset={8}
      >
        <div className="px-3 py-2">
          <p className="text-sm font-medium">{user?.email}</p>
          <p className="text-xs text-muted-foreground">Manage your account</p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/u/settings" className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/u/settings" className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserInfo