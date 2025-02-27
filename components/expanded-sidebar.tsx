"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home,
  Database,
  GitBranch,
  HardDrive,
  Settings,
  BarChart,
  LogOut,
  HardDriveDownload,
  Brain
} from 'lucide-react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { routes } from '@/lib/routes'
import { LogoutButton } from './auth/logout-button'

const mainNavigation = [
  { name: 'Dashboard', href: routes.dashboard, icon: Home },
  { name: 'Jobs', href: routes.jobs, icon: GitBranch },
  { name: 'Sources', href: routes.sources, icon: Database },
  { name: 'Destinations', href: routes.destinations, icon: HardDrive },
  { name: 'Analytics', href: routes.analytics, icon: BarChart },
  { name: 'Settings', href: routes.settings, icon: Settings },
]

const advancedNavigation = [
  { name: 'Data Storage', href: routes.dataStorage, icon: HardDriveDownload },
  { name: 'AI Insights', href: routes.aiInsights, icon: Brain },
]

export function ExpandedSidebar() {
  const pathname = usePathname()

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r bg-background px-6 pb-4">
        <div className="flex h-16 shrink-0 items-center">
          <img
            className="h-8 w-auto"
            src="/logo.svg"
            alt="FlowTechs"
          />
        </div>
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {mainNavigation.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center gap-x-3 rounded-lg px-3 py-2 text-sm font-semibold",
                          isActive
                            ? "bg-accent text-accent-foreground"
                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        )}
                      >
                        <item.icon className="h-5 w-5" />
                        {item.name}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </li>
            <li>
              <div className="relative">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-muted-foreground/20"></div>
                </div>
              </div>
              <ul role="list" className="-mx-2 mt-2 space-y-1">
                {advancedNavigation.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center gap-x-3 rounded-lg px-3 py-2 text-sm font-semibold",
                          isActive
                            ? "bg-accent text-accent-foreground"
                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        )}
                      >
                        <item.icon className="h-5 w-5" />
                        {item.name}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </li>
            <li className="mt-auto">
              <LogoutButton
                variant="ghost"
                className="w-full justify-start"
                showIcon={true}
                size="default"
              />
            </li>
          </ul>
        </nav>
      </div>
    </div>
  )
}

