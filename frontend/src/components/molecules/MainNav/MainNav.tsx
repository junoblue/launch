import * as React from "react"
import { Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import { UILD } from "@/lib/uild"

interface MainNavProps {
  isGlobalAdmin?: boolean
  className?: string
  uild?: string
}

export function MainNav({ isGlobalAdmin = false, className, uild }: MainNavProps) {
  const location = useLocation()
  const navUild = UILD.generate("component", { type: "navigation" })

  const regularItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
    },
    {
      title: "eCommerce",
      href: "/ecommerce",
    },
    {
      title: "CRM",
      href: "/crm",
    },
    {
      title: "ERP",
      href: "/erp",
    },
    {
      title: "Accounting",
      href: "/accounting",
    },
  ]

  const adminItems = [
    {
      title: "Overview",
      href: "/admin/dashboard",
    },
    {
      title: "Tenants",
      href: "/admin/tenants",
    },
    {
      title: "Users",
      href: "/admin/users",
    },
    {
      title: "Infrastructure",
      href: "/admin/infrastructure",
    },
    {
      title: "Settings",
      href: "/admin/settings",
    },
  ]

  const items = isGlobalAdmin ? adminItems : regularItems

  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      data-uild={uild || navUild}
    >
      {items.map((item) => (
        <Link
          key={item.href}
          to={item.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            location.pathname === item.href
              ? "text-primary"
              : "text-muted-foreground"
          )}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  )
} 