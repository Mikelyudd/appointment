// src/components/booking/resource/specialist-card.tsx
import { Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import type { Specialist } from '@/types/booking';

interface SpecialistCardProps {
    specialist?: Specialist;
    isSelected: boolean;
    onSelect: () => void;
}

export function SpecialistCard({ specialist, isSelected, onSelect }: SpecialistCardProps) {
    return (
        <Card
            className={cn(
                "cursor-pointer transition-all hover:border-primary",
                isSelected && "border-primary bg-primary/5"
            )}
            onClick={onSelect}
        >
            <CardContent className="p-6 flex flex-col items-center gap-4">
                {!specialist ? (
                    <>
                        <Avatar className="h-12 w-12 bg-muted">
                            <AvatarFallback>
                                <Users className="h-6 w-6" />
                            </AvatarFallback>
                        </Avatar>
                        <div className="text-center">
                            <div className="font-medium">Any specialist</div>
                            <p className="text-sm text-muted-foreground">
                                for maximum availability
                            </p>
                        </div>
                    </>
                ) : (
                    <>
                        <Avatar className="h-12 w-12 bg-primary">
                            <AvatarFallback className="text-primary-foreground">
                                {specialist.code}
                            </AvatarFallback>
                        </Avatar>
                        <div className="text-center">
                            <div className="font-medium">{specialist.name}</div>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
}
