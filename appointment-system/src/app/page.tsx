// src/app/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useBooking } from '@/contexts/BookingContext'
import { getServices } from '@/app/actions/booking'
import { ServiceCard } from '@/components/booking/services/service-card'
import { BookingSteps } from '@/components/booking/steps/booking-steps'
import { Service } from '@/types'
import {
    Card,
    CardHeader,
    CardDescription,
    CardTitle,
} from "@/components/ui/card"

export default function BookingPage() {
    const router = useRouter()
    const { state, dispatch } = useBooking()
    const [services, setServices] = useState<Service[]>([])
    const [selectedCategory, setSelectedCategory] = useState<string>('Body Treatment')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function loadServices() {
            try {
                setError(null);
                const shopId = 'aec0c125-1c74-487f-8b6d-4ce0125384a2';
                console.log('Loading services for shop:', shopId);
                const response = await getServices(shopId);
                console.log('Loaded services:', response);
                if (response.success) {
                    setServices(response.data as any || []);
                    if (response.data && response.data.length > 0) {
                        setSelectedCategory(response.data[0].category);
                    }
                } else {
                    setError(response.error || 'Failed to load services.');
                }
            } catch (error: any) {
                console.error('Failed to load services:', error);
                setError(error.message || 'Failed to load services. Please try again.');
            } finally {
                setLoading(false);
            }
        }

        loadServices();
    }, []);

    const categories = Array.from(new Set(services.map(service => service.category)))
    const filteredServices = services.filter(
        service => service.category === selectedCategory
    )

    const handleSelectService = (service: Service) => {
        dispatch({
            type: 'SELECT_SERVICE',
            payload: service
        });
        router.push('/booking/time');
    }

    if (loading) {
        return <div className="p-8 text-center">Loading services...</div>
    }

    if (error) {
        return <div className="p-8 text-center text-red-500">{error}</div>
    }

    if (services.length === 0) {
        return <div className="p-8 text-center">No services available.</div>
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <BookingSteps current="services" />

            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Select Service</CardTitle>
                    <CardDescription>
                        Choose from our available services
                    </CardDescription>
                </CardHeader>
            </Card>

            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {categories.map(category => (
                    <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors
              ${selectedCategory === category
                            ? 'bg-primary text-primary-foreground'
                            : 'border hover:bg-secondary'
                        }`}
                    >
                        {category}
                    </button>
                ))}
            </div>

            <div className="grid gap-4">
                {filteredServices.map(service => (
                    <ServiceCard
                        key={service.id}
                        service={service}
                        isSelected={state.selectedService?.id === service.id}
                        onSelect={handleSelectService}
                    />
                ))}
            </div>
        </div>
    );
}
