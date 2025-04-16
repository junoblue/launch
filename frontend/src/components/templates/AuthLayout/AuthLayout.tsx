import * as React from "react"
import { cn } from "@/lib/utils"

interface AuthLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  uild?: string
  isGlobalAdmin?: boolean
}

export function AuthLayout({
  children,
  className,
  uild,
  isGlobalAdmin = false,
  ...props
}: AuthLayoutProps) {
  return (
    <div
      className={cn(
        "min-h-screen grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
        className
      )}
      data-uild={uild}
      {...props}
    >
      {/* Branding Section */}
      <div className="hidden md:flex md:col-span-1 lg:col-span-2 bg-gradient-to-br from-primary/90 to-primary items-center justify-center p-8">
        <div className="max-w-2xl mx-auto text-white">
          <img
            src={isGlobalAdmin ? "/samurai-logo.svg" : "/launch-logo.svg"}
            alt={isGlobalAdmin ? "Samurai Admin" : "Launch Platform"}
            className="h-12 mb-8"
          />
          <h1 className="text-4xl font-bold mb-4">
            {isGlobalAdmin
              ? "Global Administration"
              : "Welcome to Launch Platform"}
          </h1>
          <p className="text-lg opacity-90">
            {isGlobalAdmin
              ? "Manage your entire infrastructure and tenant ecosystem from one central location."
              : "Access your business applications and services securely."}
          </p>
        </div>
      </div>

      {/* Auth Form Section */}
      <div className="flex flex-col justify-center p-8 bg-background">
        <div className="md:hidden mb-8">
          <img
            src={isGlobalAdmin ? "/samurai-logo.svg" : "/launch-logo.svg"}
            alt={isGlobalAdmin ? "Samurai Admin" : "Launch Platform"}
            className="h-8"
          />
        </div>
        <div className="w-full max-w-sm mx-auto space-y-6">
          {children}
        </div>
      </div>
    </div>
  )
} 