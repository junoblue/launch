import * as React from "react"
import { cn } from "@/lib/utils"
import { Header } from "@/components/organisms/Header"
import { UILD } from "@/lib/uild"

interface FrameProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  isGlobalAdmin?: boolean
  uild?: string
}

export function Frame({
  children,
  className,
  isGlobalAdmin = false,
  uild,
  ...props
}: FrameProps) {
  const frameUild = UILD.generate("layout", { type: "frame" })
  const headerUild = UILD.generate("component", { type: "header" })
  const mainUild = UILD.generate("section", { type: "main" })

  return (
    <div
      className={cn("min-h-screen bg-background", className)}
      data-uild={uild || frameUild}
      {...props}
    >
      <Header isGlobalAdmin={isGlobalAdmin} uild={headerUild} />
      <main
        className="container mx-auto py-6 space-y-6"
        data-uild={mainUild}
      >
        {children}
      </main>
    </div>
  )
} 