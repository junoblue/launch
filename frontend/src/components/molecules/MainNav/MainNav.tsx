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

  // Memoize the items array to prevent unnecessary re-renders
  const items = React.useMemo(() => {
    const regularItems = [
      {
        title: "Dashboard",
        href: "/dashboard",
      },
      {
        title: "eCommerce",
        href: "/ecommerce",
        items: [
          { title: "Products", href: "/ecommerce/products" },
          { title: "Orders", href: "/ecommerce/orders" },
          { title: "Customers", href: "/ecommerce/customers" }
        ]
      },
      {
        title: "CRM",
        href: "/crm",
        items: [
          { title: "Analytics", href: "/crm/dashboard" },
          { title: "Accounts", href: "/crm/accounts" }
        ]
      },
      {
        title: "ERP",
        href: "/erp",
        items: [
          { title: "Inventory", href: "/erp/inventory" },
          { title: "Suppliers", href: "/erp/suppliers" }
        ]
      },
      {
        title: "Accounting",
        href: "/accounting",
        items: [
          { title: "Transactions", href: "/accounting/transactions" },
          { title: "Reports", href: "/accounting/reports" }
        ]
      }
    ]

    const adminItems = [
      {
        title: "Overview",
        href: "/dashboard",
      },
      {
        title: "Tenants",
        href: "/tenants",
      },
      {
        title: "Users",
        href: "/users",
      },
      {
        title: "Infrastructure",
        href: "/infrastructure",
      },
      {
        title: "Settings",
        href: "/settings",
      },
    ]

    return isGlobalAdmin ? adminItems : regularItems
  }, [isGlobalAdmin])

  // Memoize the active state check to prevent unnecessary re-renders
  const isActive = React.useCallback((href: string) => {
    return location.pathname === href || location.pathname.startsWith(href + '/')
  }, [location.pathname])

  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      data-uild={uild || navUild}
    >
      {items.map((item) => (
        <div key={item.href} className="relative group">
          <Link
            to={item.href}
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              isActive(item.href) ? "text-primary" : "text-muted-foreground"
            )}
          >
            {item.title}
          </Link>
          
          {item.items && (
            <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-popover hidden group-hover:block">
              <div className="rounded-md ring-1 ring-black ring-opacity-5 py-1">
                {item.items.map((subItem) => (
                  <Link
                    key={subItem.href}
                    to={subItem.href}
                    className={cn(
                      "block px-4 py-2 text-sm transition-colors hover:bg-accent",
                      isActive(subItem.href) ? "text-primary" : "text-muted-foreground"
                    )}
                  >
                    {subItem.title}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </nav>
  )
} 