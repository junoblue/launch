import * as React from "react"
import { UILD } from "@/lib/uild"

interface SetupProps {
  step: number
  totalSteps: number
  title: string
  description: string
  children: React.ReactNode
}

export function Setup({ step, totalSteps, title, description, children }: SetupProps) {
  const setupUild = UILD.generate("molecule", { type: "setup", step })

  return (
    <div data-uild={setupUild} className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">{title}</h2>
          <span className="text-sm text-gray-500">
            Step {step} of {totalSteps}
          </span>
        </div>
        <p className="text-gray-600">{description}</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        {children}
      </div>
    </div>
  )
} 