// src/types/navigation.ts
export type StepStatus = 'completed' | 'current' | 'upcoming'

export interface Step {
    label: string
    path: string
    status: StepStatus
}
