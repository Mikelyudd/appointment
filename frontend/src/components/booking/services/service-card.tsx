// src/components/booking/services/service-card.tsx
import { Service } from "@/types"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ServiceCardProps {
    service: Service
    isSelected: boolean
    onSelect: (service: Service) => void
}

export function ServiceCard({ service, isSelected, onSelect }: ServiceCardProps) {
    return (
        <Card
            className={cn(
                "p-6 transition-colors cursor-pointer hover:bg-secondary/50",
                isSelected && "ring-2 ring-primary"
            )}
            onClick={() => onSelect(service)}
        >
            <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                    <h3 className="font-medium">{service.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                        {service.description}
                    </p>
                </div>
                <div className="text-right">
                    <div className="font-medium">${service.price}</div>
                    <div className="text-sm text-muted-foreground">
                        {service.duration} min
                    </div>
                </div>
            </div>
            <div className="mt-4">
                <Button
                    variant={isSelected ? "default" : "outline"}
                    className="w-full"
                    onClick={() => onSelect(service)}
                >
                    {isSelected ? "Selected" : "Select"}
                </Button>
            </div>
        </Card>
    )
}
