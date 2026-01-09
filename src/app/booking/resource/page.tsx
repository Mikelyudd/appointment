// src/app/booking/resource/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useBooking } from '@/contexts/BookingContext';
import { api } from '@/lib/api';
import type { Specialist } from '@/types';
import { BookingSteps } from '@/components/booking/steps/booking-steps';
import { PageHeader } from '@/components/page-header';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { SpecialistCard } from '@/components/booking/specialists/specialist-card';

export default function ResourcePage() {
    const router = useRouter();
    const { state, dispatch } = useBooking();
    const [specialists, setSpecialists] = useState<Specialist[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!state.selectedService) {
            router.replace('/booking/services');
            return;
        }

        async function loadSpecialists() {
            try {
                setError(null);
                const shopId = 'aec0c125-1c74-487f-8b6d-4ce0125384a2';
                console.log('Loading specialists for shop:', shopId);
                const data = await api.getSpecialists(shopId);
                console.log('Loaded specialists:', data);
                setSpecialists(data || []);
            } catch (error) {
                console.error('Failed to load specialists:', error);
                setError('Failed to load specialists. Please try again.');
            } finally {
                setLoading(false);
            }
        }

        loadSpecialists();
    }, [state.selectedService, router]);

    const handleSelectSpecialist = (specialist?: Specialist) => {
        dispatch({
            type: 'SELECT_SPECIALIST',
            payload: specialist || null
        });
        router.push('/booking/time');
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <BookingSteps current="resource" />
                <div className="text-center">Loading specialists...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <BookingSteps current="resource" />
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <BookingSteps current="resource" />
            
            <PageHeader
                title="Select resource"
                description={state.selectedService?.name}
            />

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {/* Any Specialist Card */}
                <SpecialistCard
                    isAny
                    isSelected={!state.selectedSpecialist}
                    onSelect={() => handleSelectSpecialist()}
                />

                {/* Individual Specialist Cards */}
                {specialists.map((specialist) => (
                    <SpecialistCard
                        key={specialist.id}
                        specialist={specialist}
                        isSelected={state.selectedSpecialist?.id === specialist.id}
                        onSelect={handleSelectSpecialist}
                    />
                ))}
            </div>

            {/* Selected Service Summary */}
            {state.selectedService && (
                <div className="mt-8 p-4 bg-muted rounded-lg">
                    <h3 className="font-medium mb-2">{state.selectedService.name}</h3>
                    <p className="text-sm text-muted-foreground">
                        {state.selectedService.duration} min • ${state.selectedService.price}
                    </p>
                </div>
            )}
        </div>
    );
}
