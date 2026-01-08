// components/booking/resource/specialist-grid.tsx
import { Specialist } from '@/types/booking';
import { SpecialistCard } from './specialist-card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SpecialistGridProps {
    specialists: Specialist[];
    selectedSpecialist?: Specialist;
    onSelectSpecialist: (specialist: Specialist | null) => void;
}

export function SpecialistGrid({
                                   specialists,
                                   selectedSpecialist,
                                   onSelectSpecialist
                               }: SpecialistGridProps) {
    return (
        <ScrollArea className="w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {/* Any specialist card */}
                <SpecialistCard
                    code="Any"
                    name="Any specialist"
                    description="for maximum availability"
                    isSelected={!selectedSpecialist}
                    onSelect={() => onSelectSpecialist(null)}
                    variant="ghost"
                />

                {/* Individual specialist cards */}
                {specialists.map(specialist => (
                    <SpecialistCard
                        key={specialist.id}
                        code={specialist.code}
                        name={specialist.name}
                        isSelected={selectedSpecialist?.id === specialist.id}
                        onSelect={() => onSelectSpecialist(specialist)}
                    />
                ))}
            </div>
        </ScrollArea>
    );
}
