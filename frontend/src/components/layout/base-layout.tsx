// src/components/layout/base-layout.tsx
'use client'

import { Separator } from "@/components/ui/separator"

interface BaseLayoutProps {
    children: React.ReactNode
    sidebar?: React.ReactNode
    steps?: {
        title: string
        active?: boolean
    }[]
}

export function BaseLayout({ children, sidebar, steps = [] }: BaseLayoutProps) {
    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-6">
                {/* Steps Navigation */}
                <nav className="flex items-center space-x-2 text-sm mb-6">
                    {steps.map((step, index) => (
                        <div key={step.title} className="flex items-center">
              <span className={step.active ? "text-primary" : "text-muted-foreground"}>
                {step.title}
              </span>
                            {index < steps.length - 1 && (
                                <span className="text-muted-foreground mx-2">›</span>
                            )}
                        </div>
                    ))}
                </nav>

                {/* Main Content Layout */}
                <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-6">
                    <main>{children}</main>
                    {sidebar && (
                        <aside className="h-fit">
                            {sidebar}
                        </aside>
                    )}
                </div>
            </div>
        </div>
    )
}
