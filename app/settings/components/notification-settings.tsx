"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"

const notifications = [
  {
    id: "job-complete",
    title: "Job Completion",
    description: "Get notified when a job completes successfully or fails",
  },
  {
    id: "data-sync",
    title: "Data Sync Status",
    description: "Receive updates about data synchronization status",
  },
  {
    id: "system-updates",
    title: "System Updates",
    description: "Get notified about system maintenance and updates",
  },
  {
    id: "security-alerts",
    title: "Security Alerts",
    description: "Receive notifications about security-related events",
  },
]

export function NotificationSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>
          Choose what notifications you want to receive.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="flex items-center justify-between space-x-2"
            >
              <div className="space-y-0.5">
                <Label htmlFor={notification.id}>{notification.title}</Label>
                <p className="text-sm text-muted-foreground">
                  {notification.description}
                </p>
              </div>
              <Switch id={notification.id} defaultChecked />
            </div>
          ))}
        </div>
        <div className="flex justify-end">
          <Button>Save Preferences</Button>
        </div>
      </CardContent>
    </Card>
  )
}