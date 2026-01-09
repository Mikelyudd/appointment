'use client';

import { useState, useEffect } from "react";
import { useRouter, useParams } from 'next/navigation';
import { useBooking } from '@/contexts/BookingContext';
import { getServices, getShopByCode } from '@/app/actions/booking';
import { BookingSteps } from '@/components/booking/steps/booking-steps';
import { PageHeader } from '@/components/booking/steps/page-header';
import { ServiceOptionModal } from '@/components/booking/services/service-option-modal';
import { Card } from "@/components/ui/card";
import { Check, Plus } from "lucide-react";
import type { Service } from '@/types';

export default function ServicesPage() {
    const router = useRouter();
    const { code } = useParams();
    const { dispatch } = useBooking();
    const [selectedServiceId, setSelectedServiceId] = useState<string>();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [services, setServices] = useState<Service[]>([]);
    const [shopInfo, setShopInfo] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            if (!code) return;
            const shopRes = await getShopByCode(code as string);
            if (shopRes.success) {
                setShopInfo(shopRes.data);
                const servRes = await getServices(shopRes.data.id);
                if (servRes.success) setServices(servRes.data as any);
            }
            setLoading(false);
        }
        loadData();
    }, [code]);

    const handleOptionSelect = (option: any) => {
        if (selectedService) {
            dispatch({
                type: 'SELECT_SERVICE',
                payload: {
                    ...selectedService,
                    id: selectedService.id,
                    name: option.name,
                    price: option.price,
                    optionId: option.id !== 'default' ? option.id : undefined 
                } as any
            });
            setIsModalOpen(false);
            router.push(`/s/${code}/time`);
        }
    };

    if (loading) return <div className="p-20 text-center">Loading...</div>;

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <BookingSteps current="services" />
            <PageHeader title="Select Service" description={`Welcome to ${shopInfo?.name}`} />
            <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-8">
                <div className="space-y-4">
                    {services.map((s) => (
                        <Card key={s.id} className="p-6 cursor-pointer hover:shadow-md transition-all" onClick={() => { setSelectedService(s); setSelectedServiceId(s.id); setIsModalOpen(true); }}>
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-lg font-bold">{s.name}</h3>
                                    <p className="text-sm text-gray-500">{s.duration} mins • ${Number(s.price).toFixed(2)}</p>
                                    <p className="text-sm mt-4 text-gray-600">{s.description}</p>
                                </div>
                                <div className="rounded-full w-8 h-8 border flex items-center justify-center">
                                    {selectedServiceId === s.id ? <Check className="w-5 h-5 text-yellow-600" /> : <Plus className="w-5 h-5 text-gray-300" />}
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
                <Card className="p-6 h-fit sticky top-8 text-center">
                    <h2 className="text-xl font-bold">{shopInfo?.name}</h2>
                    <p className="text-sm text-gray-500 mt-2">{shopInfo?.address}</p>
                    <p className="text-sm text-gray-500 mt-1">{shopInfo?.phone}</p>
                </Card>
            </div>
            {selectedService && (
                <ServiceOptionModal 
                    isOpen={isModalOpen} 
                    onClose={() => setIsModalOpen(false)} 
                    onSelect={handleOptionSelect} 
                    service={{ 
                        name: selectedService.name, 
                        duration: selectedService.duration, 
                        description: selectedService.description, 
                        price: Number(selectedService.price),
                        options: selectedService.options 
                    }} 
                />
            )}
        </div>
    );
}
