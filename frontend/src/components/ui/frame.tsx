import * as React from 'react'
import { cn } from '@/lib/utils'

interface FrameProps extends React.HTMLAttributes<HTMLDivElement> {
  uild?: string
  children: React.ReactNode
}

export function Frame({ uild, children, className, ...props }: FrameProps) {
  return (
    <div 
      data-uild={uild}
      className={cn(
        "min-h-screen w-full p-8 bg-background",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
} 