// src/app/booking/time/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useBooking } from '@/contexts/BookingContext';
import { getTimeSlots } from '@/app/actions/booking';
import { TimeSlot } from '@/types';
import { BookingSteps } from '@/components/booking/steps/booking-steps';
import { PageHeader } from '@/components/page-header';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
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
    const { slug } = useParams();
    const { state, dispatch } = useBooking();
    const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD'));
    const [timeSlots, setTimeSlots] = useState<GroupedTimeSlots>({
        morning: [],
        afternoon: [],
        evening: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // 生成日期选择器的日期范围
    const dates = Array.from({ length: 7 }, (_, i) => {
        return moment().add(i, 'days');
    });

    useEffect(() => {
        // 如果没有选择服务，重定向到服务选择页面
        if (!state.selectedService) {
            router.replace(`/shop/${slug}/services`);
            return;
        }

        async function loadTimeSlots() {
            try {
                setError(null);
                setLoading(true);
                const shopId = state.selectedService!.shopId;

                // 获取可用时间段 (不再需要 specialistId)
                const data = await getTimeSlots(shopId, selectedDate);
                setTimeSlots(data as any);
            } catch (error: any) {
                console.error('Failed to load time slots:', error);
                setError(error.message || 'Failed to load time slots. Please try again.');
            } finally {
                setLoading(false);
            }
        }

        loadTimeSlots();
    }, [state.selectedService, selectedDate, router]);

    const handleSelectDate = (date: string) => {
        setSelectedDate(date);
    };

    const handleSelectTime = (slot: TimeSlot) => {
        if (!slot.isAvailable) return;

        console.log('Selected time slot:', slot);
        dispatch({ type: 'SELECT_TIME_SLOT', payload: slot });
        router.push(`/shop/${slug}/confirm`);
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <BookingSteps current="time" />
                <div className="text-center">Loading time slots...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <BookingSteps current="time" />
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <BookingSteps current="time" />
            
            <PageHeader
                title="Select time"
                description={state.selectedService?.name}
            />

            {/* Date Selection */}
            <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">
                    {moment(selectedDate).format('MMMM')}
                </h3>
                <div className="flex items-center justify-between mb-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                            const newDates = dates.map(d => moment(d).subtract(7, 'days'));
                            setSelectedDate(newDates[0].format('YYYY-MM-DD'));
                        }}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="grid grid-cols-7 gap-2 flex-1 px-4">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                            <div key={day} className="text-center text-xs font-medium text-gray-500">
                                {day}
                            </div>
                        ))}
                        {dates.map((date) => {
                            const dateStr = date.format('YYYY-MM-DD');
                            const isSelected = dateStr === selectedDate;
                            return (
                                <Button
                                    key={dateStr}
                                    variant={isSelected ? 'default' : 'outline'}
                                    className={cn(
                                        'flex-col items-center justify-center h-12 p-0',
                                        isSelected && 'bg-teal-600 hover:bg-teal-600 text-white'
                                    )}
                                    onClick={() => handleSelectDate(dateStr)}
                                >
                                    <div className="text-lg">
                                        {date.format('D')}
                                    </div>
                                </Button>
                            );
                        })}
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                            const newDates = dates.map(d => moment(d).add(7, 'days'));
                            setSelectedDate(newDates[0].format('YYYY-MM-DD'));
                        }}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Time Slots */}
            <div className="space-y-8">
                {/* Morning */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-medium">Morning</h3>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                    </div>
                    {timeSlots.morning.length > 0 ? (
                        <div className="grid grid-cols-4 gap-3">
                            {timeSlots.morning.map((slot) => (
                                <Button
                                    key={slot.id}
                                    variant={state.selectedTimeSlot?.id === slot.id ? 'default' : 'outline'}
                                    className={cn(
                                        'w-full h-auto py-3 rounded-lg relative',
                                        state.selectedTimeSlot?.id === slot.id && 'bg-teal-600 hover:bg-teal-600 text-white',
                                        !slot.isAvailable && 'bg-gray-100 text-gray-400 hover:bg-gray-100 cursor-not-allowed'
                                    )}
                                    onClick={() => slot.isAvailable && handleSelectTime(slot)}
                                    disabled={!slot.isAvailable}
                                >
                                    <span>{moment(slot.startTime, 'HH:mm').format('h:mm A')}</span>
                                    {!slot.isAvailable && (
                                        <span className="absolute bottom-1 left-0 right-0 text-[10px] text-gray-500">
                                            已预约
                                        </span>
                                    )}
                                </Button>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">
                            No appointments available in the morning.
                        </p>
                    )}
                </div>

                {/* Afternoon */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-medium">Afternoon</h3>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                    </div>
                    {timeSlots.afternoon.length > 0 ? (
                        <div className="grid grid-cols-4 gap-3">
                            {timeSlots.afternoon.map((slot) => (
                                <Button
                                    key={slot.id}
                                    variant={state.selectedTimeSlot?.id === slot.id ? 'default' : 'outline'}
                                    className={cn(
                                        'w-full h-auto py-3 rounded-lg relative',
                                        state.selectedTimeSlot?.id === slot.id && 'bg-teal-600 hover:bg-teal-600 text-white',
                                        !slot.isAvailable && 'bg-gray-100 text-gray-400 hover:bg-gray-100 cursor-not-allowed'
                                    )}
                                    onClick={() => slot.isAvailable && handleSelectTime(slot)}
                                    disabled={!slot.isAvailable}
                                >
                                    <span>{moment(slot.startTime, 'HH:mm').format('h:mm A')}</span>
                                    {!slot.isAvailable && (
                                        <span className="absolute bottom-1 left-0 right-0 text-[10px] text-gray-500">
                                            已预约
                                        </span>
                                    )}
                                </Button>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">
                            No appointments available in the afternoon.
                        </p>
                    )}
                </div>

                {/* Evening */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-medium">Evening</h3>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                    </div>
                    {timeSlots.evening.length > 0 ? (
                        <div className="grid grid-cols-4 gap-3">
                            {timeSlots.evening.map((slot) => (
                                <Button
                                    key={slot.id}
                                    variant={state.selectedTimeSlot?.id === slot.id ? 'default' : 'outline'}
                                    className={cn(
                                        'w-full h-auto py-3 rounded-lg relative',
                                        state.selectedTimeSlot?.id === slot.id && 'bg-teal-600 hover:bg-teal-600 text-white',
                                        !slot.isAvailable && 'bg-gray-100 text-gray-400 hover:bg-gray-100 cursor-not-allowed'
                                    )}
                                    onClick={() => slot.isAvailable && handleSelectTime(slot)}
                                    disabled={!slot.isAvailable}
                                >
                                    <span>{moment(slot.startTime, 'HH:mm').format('h:mm A')}</span>
                                    {!slot.isAvailable && (
                                        <span className="absolute bottom-1 left-0 right-0 text-[10px] text-gray-500">
                                            已预约
                                        </span>
                                    )}
                                </Button>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">
                            No appointments available in the evening.
                        </p>
                    )}
                </div>
            </div>

            {/* Selected Service Summary */}
            {state.selectedService && (
                <div className="mt-8 p-6 bg-white rounded-lg border">
                    <h3 className="font-medium mb-2">{state.selectedService.name}</h3>
                    <div className="text-sm text-muted-foreground">
                        <div>{state.selectedService.duration} min • {state.selectedService.name}</div>
                        {state.selectedSpecialist && (
                            <div className="mt-1">with {state.selectedSpecialist.name}</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
