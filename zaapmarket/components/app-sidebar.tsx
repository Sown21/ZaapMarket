"use client"

import * as React from "react"
import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: IconDashboard,
      isActive: true,
    },
  ],
  navClouds: [
  ],
  navSecondary: [
  ],
  documents: [
  ],
}

export function AppSidebar({ session, ...props }: React.ComponentProps<typeof Sidebar> & { 
  session?: { user: { id?: string; name?: string | null; email?: string | null } } 
}) {
  // Mise à jour des données utilisateur si la session est disponible
  const userData = session?.user ? {
    name: session.user.name || "Utilisateur",
    email: session.user.email || "utilisateur@exemple.com",
    avatar: "/avatars/shadcn.jpg", // On garde l'avatar par défaut
  } : data.user;

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader className="pb-6">
        <SidebarMenu>
          <SidebarMenuItem className="py-2">
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-.5"
            >
              <a href="#">
                <img 
                  src="/zaap_detour.png" 
                  alt="ZaapMarket Logo" 
                  className="h-12 w-12 mr-4"
                />
                <span className="text-2xl font-bold">ZaapMarket</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <div className="px-6 py-2">
        <div className="h-[5px] bg-white/80 rounded-full w-full mx-auto opacity-60"></div>
      </div>
      <SidebarContent className="pt-4">
        <NavMain items={data.navMain} />
        {/* Sections commentées car vides
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
        */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  )
}
