'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useBooking } from '@/contexts/BookingContext';
import { getTimeSlots } from '@/app/actions/booking';
import { TimeSlot } from '@/types';
import { BookingSteps } from '@/components/booking/steps/booking-steps';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import moment from 'moment';

interface GroupedTimeSlots {
    morning: TimeSlot[];
    afternoon: TimeSlot[];
    evening: TimeSlot[];
}

export default function TimePage() {
    const router = useRouter();
    const { code } = useParams();
    const { state, dispatch } = useBooking();
    const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD'));
    const [timeSlots, setTimeSlots] = useState<GroupedTimeSlots>({
        morning: [],
        afternoon: [],
        evening: []
    });
    const [loading, setLoading] = useState(true);

    const dates = Array.from({ length: 7 }, (_, i) => moment().add(i, 'days'));

    useEffect(() => {
        if (!state.selectedService) {
            router.replace(`/s/${code}/services`);
            return;
        }

        async function loadTimeSlots() {
            setLoading(true);
            try {
                const data = await getTimeSlots(state.selectedService!.shopId, selectedDate);
                setTimeSlots(data as any);
            } catch (error) {
                console.error('Failed to load time slots:', error);
            } finally {
                setLoading(false);
            }
        }

        loadTimeSlots();
    }, [state.selectedService, selectedDate, code, router]);

    const handleSelectTime = (slot: TimeSlot) => {
        if (!slot.isAvailable) return;
        dispatch({ type: 'SELECT_TIME_SLOT', payload: slot });
        router.push(`/s/${code}/confirm`);
    };

    if (loading && timeSlots.morning.length === 0) return <div className="p-20 text-center">Loading slots...</div>;

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <BookingSteps current="time" />
            <PageHeader title="Select time" description={state.selectedService?.name} />
            
            <div className="mb-8 flex gap-4 overflow-x-auto pb-4">
                {dates.map((date) => {
                    const dateStr = date.format('YYYY-MM-DD');
                    const isSelected = dateStr === selectedDate;
                    return (
                        <Button key={dateStr} variant={isSelected ? 'default' : 'outline'} className={cn('flex-col min-w-[80px] h-20', isSelected && 'bg-yellow-600 text-white')} onClick={() => setSelectedDate(dateStr)}>
                            <span className="text-xs uppercase">{date.format('ddd')}</span>
                            <span className="text-xl font-bold">{date.format('D')}</span>
                        </Button>
                    );
                })}
            </div>

            <div className="space-y-8">
                {['morning', 'afternoon', 'evening'].map((period) => (
                    <div key={period}>
                        <h3 className="font-medium capitalize mb-4 text-gray-500">{period}</h3>
                        <div className="grid grid-cols-4 gap-3">
                            {timeSlots[period as keyof GroupedTimeSlots].map((slot) => (
                                <Button key={slot.id} variant={state.selectedTimeSlot?.id === slot.id ? 'default' : 'outline'} className={cn('h-12', !slot.isAvailable && 'opacity-50 cursor-not-allowed')} disabled={!slot.isAvailable} onClick={() => handleSelectTime(slot)}>
                                    {moment(slot.startTime, 'HH:mm').format('h:mm A')}
                                </Button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
