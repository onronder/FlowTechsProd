"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { X } from "lucide-react"
import { Button } from "./button"
import { Checkbox } from "./checkbox"

const tooltipContent = {
  "/": "Welcome to your dashboard! Here you can monitor all your data flows and system status.",
  "/sources": "Manage your data sources and configure new integrations here.",
  "/destinations": "Set up and manage your data destinations, including databases and APIs.",
  "/analytics": "View detailed analytics and insights about your data flows.",
  "/settings": "Configure your account settings and preferences.",
  "/data-storage": "Manage your data storage solutions and configurations.",
  "/ai-insights": "Get AI-powered insights and recommendations for your data.",
  "/jobs": "Monitor and manage your data transformation jobs.",
}

export function PageTooltip() {
  const pathname = usePathname()
  const [isVisible, setIsVisible] = useState(false)
  const [dontShowAgain, setDontShowAgain] = useState(false)

  useEffect(() => {
    // Check if tooltip should be shown for this page
    const hiddenTooltips = JSON.parse(localStorage.getItem("hiddenTooltips") || "{}")
    if (!hiddenTooltips[pathname]) {
      setIsVisible(true)
    }
  }, [pathname])

  const handleClose = () => {
    setIsVisible(false)
    if (dontShowAgain) {
      const hiddenTooltips = JSON.parse(localStorage.getItem("hiddenTooltips") || "{}")
      hiddenTooltips[pathname] = true
      localStorage.setItem("hiddenTooltips", JSON.stringify(hiddenTooltips))
    }
  }

  if (!isVisible || !tooltipContent[pathname as keyof typeof tooltipContent]) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 max-w-sm bg-popover text-popover-foreground p-4 rounded-lg shadow-lg border animate-in slide-in-from-bottom-5">
      <div className="flex justify-between items-start mb-2">
        <p className="text-sm font-medium">
          {tooltipContent[pathname as keyof typeof tooltipContent]}
        </p>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={handleClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="dont-show"
          checked={dontShowAgain}
          onCheckedChange={(checked) => setDontShowAgain(checked as boolean)}
        />
        <label
          htmlFor="dont-show"
          className="text-sm text-muted-foreground cursor-pointer"
        >
          Don&apos;t show this message again
        </label>
      </div>
    </div>
  )
}