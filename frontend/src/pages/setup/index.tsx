import * as React from "react"
import { UILD } from "@/lib/uild"
import { Setup } from "@/components/molecules/Setup"

export default function SetupPage() {
  const pageUild = UILD.generate("page", { type: "setup" })
  const [currentStep] = React.useState(1)
  const totalSteps = 4

  return (
    <div data-uild={pageUild} className="max-w-2xl mx-auto py-8">
      <Setup
        step={currentStep}
        totalSteps={totalSteps}
        title="Welcome to Launch"
        description="Let's get your workspace set up. We'll guide you through the process."
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-700">
              Company Name
            </label>
            <input
              type="text"
              id="company"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="industry" className="block text-sm font-medium text-gray-700">
              Industry
            </label>
            <select
              id="industry"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option>Select an industry</option>
              <option>Technology</option>
              <option>Manufacturing</option>
              <option>Retail</option>
              <option>Services</option>
            </select>
          </div>
          <div className="pt-4">
            <button
              type="button"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Continue
            </button>
          </div>
        </div>
      </Setup>
    </div>
  )
} 