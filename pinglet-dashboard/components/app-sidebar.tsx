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
  Sparkles,
  Activity,
  Video,
  Inbox,
  UserMinus,
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
        {
          title: "Activity",
          url: "/u/activity",
          icon: Activity,
        },
        {
          title: "Sessions",
          url: "/u/sessions",
          icon: Video,
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
          title: "Inbox",
          url: "/u/inbox",
          icon: Inbox,
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
        {
          title: "Unsubscribes",
          url: "/u/unsubscribe-analytics",
          icon: UserMinus,
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
              <Link href="/u/dashboard" className="cursor-pointer group/brand">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg gradient-primary text-white shadow-md shadow-primary/25 transition-shadow duration-300 group-hover/brand:shadow-lg group-hover/brand:shadow-primary/30">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">Pinglet</span>
                  <span className="truncate text-xs text-muted-foreground">Push Notifications</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {data.navMain.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel className="text-[10px] uppercase tracking-widest text-muted-foreground/70 font-semibold">{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive = pathname === item.url
                  return (
                    <SidebarMenuItem
                      key={item.title}
                      className={`transition-all duration-200 rounded-md ${
                        isActive
                          ? "bg-sidebar-accent shadow-sm"
                          : "hover:bg-sidebar-accent/50"
                      }`}
                    >
                      <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
                        <Link href={item.url} className="group/nav-item">
                          <item.icon className={`transition-colors duration-200 ${
                            isActive
                              ? "text-primary"
                              : "text-muted-foreground group-hover/nav-item:text-primary/70"
                          }`} />
                          <span className={`transition-colors duration-200 ${
                            isActive
                              ? "text-sidebar-accent-foreground font-medium"
                              : "group-hover/nav-item:text-foreground"
                          }`}>{item.title}</span>
                          {isActive && (
                            <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
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
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground/60">
            <span>Made with</span>
            <Heart className="h-2.5 w-2.5 fill-red-500 text-red-500" />
            <span>by Enjoys</span>
          </div>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
