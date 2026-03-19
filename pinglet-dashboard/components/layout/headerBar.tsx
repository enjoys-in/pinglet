"use client"

import React from "react"
import { SidebarTrigger } from "../ui/sidebar"
import { Separator } from "../ui/separator"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "../ui/breadcrumb"
import { Button } from "../ui/button"
import { Bell, Search, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Input } from "../ui/input"
import { Badge } from "../ui/badge"
import { usePathname } from "next/navigation"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"
import UserInfo from "./userInfo"

const HeaderBar = () => {
    const { setTheme, theme } = useTheme()
    const pathname = usePathname()

    const getBreadcrumbs = () => {
        const segments = pathname.split("/").filter(Boolean)
        return segments.map((segment, index) => ({
            title: segment.charAt(0).toUpperCase() + segment.slice(1),
            href: "/" + segments.slice(0, index + 1).join("/"),
            isLast: index === segments.length - 1,
        }))
    }

    const breadcrumbs = getBreadcrumbs()

    return (
        <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border/50 px-4 sticky top-0 z-50 w-full glass transition-all duration-300">
            <SidebarTrigger className="-ml-1 text-muted-foreground hover:text-foreground transition-colors" />
            <Separator orientation="vertical" className="mr-2 h-4" />

            <Breadcrumb className="hidden sm:flex">
                <BreadcrumbList>
                    {breadcrumbs.map((breadcrumb, index) => (
                        <React.Fragment key={breadcrumb.href}>
                            {index > 0 && <BreadcrumbSeparator />}
                            <BreadcrumbItem>
                                {breadcrumb.isLast ? (
                                    <BreadcrumbPage className="font-medium">{breadcrumb.title}</BreadcrumbPage>
                                ) : (
                                    <BreadcrumbLink href={breadcrumb.href} className="text-muted-foreground hover:text-foreground transition-colors">{breadcrumb.title}</BreadcrumbLink>
                                )}
                            </BreadcrumbItem>
                        </React.Fragment>
                    ))}
                </BreadcrumbList>
            </Breadcrumb>

            <div className="ml-auto flex items-center gap-1.5">
                <div className="relative hidden md:block">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search..."
                        className="w-[200px] lg:w-[260px] pl-8 h-8 text-sm bg-muted/50 border-border/50 focus:bg-background transition-colors rounded-lg"
                    />
                </div>

                <TooltipProvider delayDuration={0}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="relative h-8 w-8 text-muted-foreground hover:text-foreground transition-colors">
                                <Bell className="h-4 w-4" />
                                <Badge className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full p-0 text-[10px] flex items-center justify-center gradient-primary border-0 text-white">3</Badge>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">
                            <p>Notifications</p>
                        </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-foreground transition-colors"
                                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                            >
                                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                                <span className="sr-only">Toggle theme</span>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">
                            <p>Toggle theme</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

                <Separator orientation="vertical" className="mx-1 h-4" />

                <UserInfo />
            </div>
        </header>
    )
}

export default HeaderBar