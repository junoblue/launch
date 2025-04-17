import * as React from "react"
import { UILD } from "@/lib/uild"

interface FrameProps {
  children: React.ReactNode
  isGlobalAdmin?: boolean
}

export function Frame({ children, isGlobalAdmin }: FrameProps) {
  const frameUild = UILD.generate("layout", { type: isGlobalAdmin ? "admin" : "app" })

  return (
    <div data-uild={frameUild} className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="text-xl font-bold">
            {isGlobalAdmin ? "Launch Admin" : "Launch"}
          </div>
          {/* Navigation will be added here */}
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
    </div>
  )
} 