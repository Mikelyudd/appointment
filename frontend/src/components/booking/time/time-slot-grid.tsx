// src/components/booking/time/time-slot-grid.tsx
import { Card } from '@/components/ui/card';
import type { TimeSlot } from '@/types/booking';
import { cn } from '@/lib/utils';

interface TimeSlotGridProps {
    slots: TimeSlot[];
    selectedSlot?: TimeSlot;
    onSelectSlot: (slot: TimeSlot) => void;
}

export function TimeSlotGrid({ slots, selectedSlot, onSelectSlot }: TimeSlotGridProps) {
    // 按时间段分组
    const groupedSlots = slots.reduce((acc, slot) => {
        if (!acc[slot.timeOfDay]) {
            acc[slot.timeOfDay] = [];
        }
        acc[slot.timeOfDay].push(slot);
        return acc;
    }, {} as Record<string, TimeSlot[]>);

    const timeOfDayLabels = {
        morning: 'Morning',
        afternoon: 'Afternoon',
        evening: 'Evening'
    };

    return (
        <div className="space-y-6">
            {Object.entries(groupedSlots).map(([timeOfDay, timeSlots]) => (
                <Card key={timeOfDay} className="p-4">
                    <h3 className="font-medium mb-4">{timeOfDayLabels[timeOfDay as keyof typeof timeOfDayLabels]}</h3>
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                        {timeSlots.map((slot) => (
                            <button
                                key={slot.id}
                                onClick={() => onSelectSlot(slot)}
                                disabled={!slot.isAvailable}
                                className={cn(
                                    "p-2 rounded-lg text-sm border",
                                    slot.isAvailable ? "hover:bg-gray-100" : "opacity-50 cursor-not-allowed",
                                    selectedSlot?.id === slot.id && "bg-primary text-primary-foreground hover:bg-primary/90"
                                )}
                            >
                                {slot.startTime}
                            </button>
                        ))}
                    </div>
                </Card>
            ))}
        </div>
    );
}
