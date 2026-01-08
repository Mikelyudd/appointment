// src/components/booking/steps/booking-steps.tsx
"use client";

import { cn } from "@/lib/utils"

interface BookingStepsProps {
    current: 'services' | 'resource' | 'time' | 'confirm'
}

export function BookingSteps({ current }: BookingStepsProps) {
    const steps = [
        { id: 'services', label: 'Services' },
        { id: 'resource', label: 'Resource' },
        { id: 'time', label: 'Time' },
        { id: 'confirm', label: 'Confirm' }
    ]

    return (
        <nav aria-label="Progress" className="mb-8">
            <ol role="list" className="flex items-center">
                {steps.map((step, stepIdx) => (
                    <li
                        key={step.id}
                        className={cn(
                            stepIdx !== steps.length - 1 ? 'pr-8 sm:pr-20' : '',
                            'relative'
                        )}
                    >
                        <div className="flex items-center">
                            <div
                                className={cn(
                                    'h-8 w-8 flex items-center justify-center rounded-full',
                                    current === step.id
                                        ? 'bg-primary text-primary-foreground'
                                        : steps.findIndex(s => s.id === current) > stepIdx
                                            ? 'bg-primary/20'
                                            : 'bg-secondary'
                                )}
                            >
                                <span className="text-sm font-medium">
                                    {stepIdx + 1}
                                </span>
                            </div>
                            <span
                                className={cn(
                                    'ml-4 text-sm font-medium',
                                    current === step.id ? 'text-primary' : 'text-muted-foreground'
                                )}
                            >
                                {step.label}
                            </span>
                        </div>
                        {stepIdx !== steps.length - 1 && (
                            <div
                                className={cn(
                                    'absolute left-0 top-4 -ml-px mt-0.5 h-0.5 w-full',
                                    steps.findIndex(s => s.id === current) > stepIdx
                                        ? 'bg-primary/20'
                                        : 'bg-secondary'
                                )}
                            />
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    )
}
