"use client"

import { type Icon } from "@tabler/icons-react"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: Icon
    isActive?: boolean
  }[]
}) {
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton 
                tooltip={item.title}
                isActive={item.isActive}
                className={item.isActive 
                  ? "bg-primary/15 font-semibold border-l-4 border-primary pl-3 shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] text-primary-foreground dark:text-white transition-all duration-200 ease-out scale-105 hover:bg-primary/25"
                  : "hover:bg-primary/5 transition-all duration-200"}
              >
                {item.icon && <item.icon className={item.isActive 
                  ? "text-primary mr-2 transition-transform duration-300 transform scale-110" 
                  : "mr-2"} />}
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
