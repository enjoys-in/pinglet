"use client"

import type * as React from "react"
import {
  BarChart3,
  Bell,
  Globe,
  LayoutDashboard,
  FolderOpen,
  Webhook,
  GitBranch,
  Settings,
  Heart, 
  Globe2,
  WalletCards,
  HeartHandshake,
  
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Userbar from "./userbar"

const data = {
  navMain: [
    {
      title: "Overview",
      items: [
        {
          title: "Dashboard",
          url: "/u/dashboard",
          icon: LayoutDashboard,
        },
        {
          title: "Analytics",
          url: "/u/analytics",
          icon: BarChart3,
        },
      ],
    },
    {
      title: "Management",
      items: [
        {
          title: "Websites",
          url: "/u/websites",
          icon: Globe2,
        },

        {
          title: "Projects",
          url: "/u/projects",
          icon: FolderOpen,
        },
        {
          title: "Widgets",
          url: "/u/widgets",
          icon: HeartHandshake,
        },
        {
          title: "Templates",
          url: "/u/templates",
          icon: WalletCards,
        },
        {
          title: "Notifications",
          url: "/u/notifications",
          icon: Bell,
        },
        {
          title: "Domains",
          url: "/u/domains",
          icon: Globe,
        },
        {
          title: "Flows",
          url: "/u/flows",
          icon: GitBranch,
        },
        {
          title: "Webhooks",
          url: "/u/webhooks",
          icon: Webhook,
        },
      ],
    },
    {
      title: "Settings",
      items: [
        {
          title: "Account",
          url: "/u/settings",
          icon: Settings,
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard" className="cursor-pointer">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <span className="font-bold text-lg">P</span>
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Pinglet</span>
                  <span className="truncate text-xs">Push Notifications</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {data.navMain.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title} className={`${pathname === item.url && "bg-zinc-800"} hover:bg-zinc-100  dark:hover:bg-zinc-800/30`}>
                    <SidebarMenuButton asChild isActive={pathname === item.url} tooltip={item.title}>
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Userbar />
            </SidebarMenuButton>

          </SidebarMenuItem>
        </SidebarMenu>

        <div className="px-2 py-1">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span>Made with</span>
            <Heart className="h-3 w-3 fill-red-500 text-red-500" />
            <span>by Enjoys</span>
          </div>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
