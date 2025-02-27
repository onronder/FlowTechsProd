"use client"

import { Home, Database, GitBranch, HardDrive, Settings, BarChart, LogOut } from 'lucide-react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"

const navItems = [
  { title: 'Dashboard', icon: Home, href: '/' },
  { title: 'My Sources', icon: Database, href: '/sources' },
  { title: 'Transformation', icon: GitBranch, href: '/transformations' },
  { title: 'My Destinations', icon: HardDrive, href: '/destinations' },
  { title: 'Analytics', icon: BarChart, href: '/analytics' },
  { title: 'Settings', icon: Settings, href: '/settings' },
]

export function NavbarSimple() {
  const pathname = usePathname()

  return (
    <div className="flex h-screen w-16 flex-col justify-between border-r border-border bg-card">
      <div>
        <div className="inline-flex h-16 w-16 items-center justify-center">
          <span className="grid h-10 w-10 place-content-center rounded-lg bg-purple-primary text-white text-xs font-semibold">
            F
          </span>
        </div>

        <div className="border-t border-border">
          <nav aria-label="Main Nav" className="flex flex-col p-2">
            <TooltipProvider>
              {navItems.map((item) => (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        "group relative flex justify-center rounded-lg p-2 text-muted-foreground hover:bg-purple-primary/10 hover:text-purple-primary transition-colors",
                        pathname === item.href && "bg-purple-primary/10 text-purple-primary"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="bg-white border-border">
                    <p>{item.title}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </TooltipProvider>
          </nav>
        </div>
      </div>

      <div className="sticky inset-x-0 bottom-0 border-t border-border p-2">
        <div className="flex flex-col gap-2">
          <ThemeToggle />
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-lg text-muted-foreground hover:bg-purple-primary/10 hover:text-purple-primary"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}

