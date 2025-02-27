"use client"

import { Home, Database, GitBranch, HardDrive, Settings, BarChart } from 'lucide-react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar'

const navItems = [
  { title: 'Dashboard', icon: Home, href: '/' },
  { title: 'My Sources', icon: Database, href: '/sources' },
  { title: 'Transformation', icon: GitBranch, href: '/transformations' },
  { title: 'My Destinations', icon: HardDrive, href: '/destinations' },
  { title: 'Analytics', icon: BarChart, href: '/analytics' },
  { title: 'Settings', icon: Settings, href: '/settings' },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar className="hidden md:block h-screen">
      <SidebarHeader>
        <h2 className="text-xl font-bold">FlowTechs</h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={pathname === item.href}>
                    <Link href={item.href}>
                      <item.icon className="mr-2 h-4 w-4" />
                      {item.title}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}

