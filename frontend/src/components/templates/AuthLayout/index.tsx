import * as React from "react"
import { UILD } from "@/lib/uild"

interface AuthLayoutProps {
  children: React.ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  const layoutUild = UILD.generate("layout", { type: "auth" })

  return (
    <div data-uild={layoutUild} className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Launch</h1>
          <p className="text-gray-600">Login to your account</p>
        </div>
        {children}
      </div>
    </div>
  )
} 