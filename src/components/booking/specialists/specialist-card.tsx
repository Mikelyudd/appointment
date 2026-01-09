import { Card } from "@/components/ui/card"
import { Users } from "lucide-react"
import { Specialist } from "@/types"

interface SpecialistCardProps {
    specialist?: Specialist
    isSelected: boolean
    onSelect: (specialist?: Specialist) => void
    isAny?: boolean
}

export function SpecialistCard({ specialist, isSelected, onSelect, isAny }: SpecialistCardProps) {
    return (
        <Card
            className={`p-6 cursor-pointer transition-all hover:shadow-md ${
                isSelected ? 'ring-2 ring-primary bg-primary/5' : ''
            }`}
            onClick={() => onSelect(specialist)}
        >
            <div className="flex flex-col items-center text-center">
                {isAny ? (
                    <>
                        <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                            <Users className="w-8 h-8 text-blue-500" />
                        </div>
                        <h3 className="font-medium">Any specialist</h3>
                        <p className="text-sm text-muted-foreground">for maximum availability</p>
                    </>
                ) : (
                    <>
                        <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground mb-4">
                            <span className="text-lg font-medium">{specialist?.code || 'S'}</span>
                        </div>
                        <h3 className="font-medium">{specialist?.name || 'Specialist'}</h3>
                    </>
                )}
            </div>
        </Card>
    )
} 