import * as React from "react"
import { useNavigate } from "react-router-dom"
import { Frame } from "@/components/templates/Frame"
import { Setup } from "@/components/molecules/Setup"
import { UILD } from "@/lib/uild"

export default function SetupPage() {
  const navigate = useNavigate()
  const pageUild = UILD.generate("page", { type: "setup" })

  const handleSetupComplete = () => {
    // Here you would typically save the setup state
    // and redirect to the dashboard
    navigate("/dashboard")
  }

  return (
    <Frame uild={pageUild}>
      <Setup onComplete={handleSetupComplete} />
    </Frame>
  )
} 