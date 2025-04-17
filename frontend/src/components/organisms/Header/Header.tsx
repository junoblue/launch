import * as React from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { UserNav } from "@/components/molecules/UserNav"
import { MainNav } from "@/components/molecules/MainNav"
import { UILD } from "@/lib/uild"

interface HeaderProps {
  isGlobalAdmin?: boolean
  uild?: string
}

export function Header({ isGlobalAdmin = false, uild }: HeaderProps) {
  const searchUild = UILD.generate("component", { type: "search" })
  
  return (
    <div className="border-b" data-uild={uild}>
      <div className="flex h-16 items-center px-4">
        <div className="flex items-center space-x-6">
          <img
            src={isGlobalAdmin ? "/samurai-icon.svg" : "/launch-icon.svg"}
            alt={isGlobalAdmin ? "Samurai" : "Launch"}
            className="h-8 w-8"
          />
          <MainNav isGlobalAdmin={isGlobalAdmin} />
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="pl-8"
              uild={searchUild}
            />
          </div>
          <UserNav />
        </div>
      </div>
    </div>
  )
} 