// src/components/booking/time/date-selector.tsx
import { useState } from 'react';
import { format, addDays, isSameDay } from 'date-fns';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface DateSelectorProps {
    selectedDate?: string;
    onSelectDate: (date: string) => void;
}

export function DateSelector({ selectedDate, onSelectDate }: DateSelectorProps) {
    const [weekOffset, setWeekOffset] = useState(0);
    const today = new Date();

    // 生成一周的日期
    const weekDates = Array.from({ length: 7 }).map((_, index) => {
        return addDays(today, index + (weekOffset * 7));
    });

    return (
        <Card className="p-4 mb-6">
            <div className="flex items-center justify-between mb-4">
                <button
                    onClick={() => setWeekOffset(prev => prev - 1)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                    disabled={weekOffset === 0}
                >
                    <ChevronLeft className="h-5 w-5" />
                </button>
                <h3 className="font-medium">
                    {format(weekDates[0], 'MMM d')} - {format(weekDates[6], 'MMM d')}
                </h3>
                <button
                    onClick={() => setWeekOffset(prev => prev + 1)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                >
                    <ChevronRight className="h-5 w-5" />
                </button>
            </div>

            <div className="grid grid-cols-7 gap-2">
                {weekDates.map((date) => {
                    const dateStr = format(date, 'yyyy-MM-dd');
                    const isSelected = selectedDate === dateStr;
                    const isToday = isSameDay(date, today);

                    return (
                        <button
                            key={dateStr}
                            onClick={() => onSelectDate(dateStr)}
                            className={cn(
                                "flex flex-col items-center p-2 rounded-lg hover:bg-gray-100",
                                isSelected && "bg-primary text-primary-foreground hover:bg-primary/90",
                                isToday && !isSelected && "border-2 border-primary"
                            )}
                        >
                            <span className="text-xs">{format(date, 'EEE')}</span>
                            <span className="text-lg font-medium">{format(date, 'd')}</span>
                        </button>
                    );
                })}
            </div>
        </Card>
    );
}
