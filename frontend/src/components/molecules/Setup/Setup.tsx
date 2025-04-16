import * as React from "react"
import { Settings, Database, Cloud, Users, Key } from "lucide-react"
import { cn } from "@/lib/utils"
import { UILD } from "@/lib/uild"
import { Button } from "@/components/atoms/Button"

interface SetupItem {
  title: string
  description: string
  icon: React.ReactNode
  status: "completed" | "pending" | "in-progress"
  action?: () => void
}

interface SetupProps {
  className?: string
  uild?: string
  onComplete?: () => void
}

export function Setup({ className, uild, onComplete }: SetupProps) {
  const setupUild = UILD.generate("component", { type: "setup" })

  const setupItems: SetupItem[] = [
    {
      title: "Database Configuration",
      description: "Configure your database connection and schema",
      icon: <Database className="h-5 w-5" />,
      status: "pending",
    },
    {
      title: "Cloud Services",
      description: "Set up cloud storage and CDN",
      icon: <Cloud className="h-5 w-5" />,
      status: "pending",
    },
    {
      title: "User Management",
      description: "Configure user roles and permissions",
      icon: <Users className="h-5 w-5" />,
      status: "pending",
    },
    {
      title: "API Keys",
      description: "Generate and manage API keys",
      icon: <Key className="h-5 w-5" />,
      status: "pending",
    },
  ]

  return (
    <div className={cn("space-y-6", className)} data-uild={uild || setupUild}>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">Setup</h2>
        <Button variant="outline" size="sm" onClick={onComplete}>
          <Settings className="mr-2 h-4 w-4" />
          Complete Setup
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {setupItems.map((item, index) => (
          <div
            key={index}
            className={cn(
              "flex items-start space-x-4 rounded-lg border p-4",
              item.status === "completed" && "border-green-500",
              item.status === "in-progress" && "border-yellow-500",
              item.status === "pending" && "border-gray-200"
            )}
          >
            <div className="rounded-full bg-primary/10 p-2 text-primary">
              {item.icon}
            </div>
            <div className="space-y-1">
              <h3 className="font-medium">{item.title}</h3>
              <p className="text-sm text-muted-foreground">
                {item.description}
              </p>
              <Button
                variant="ghost"
                size="sm"
                className="mt-2"
                onClick={item.action}
              >
                Configure
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 