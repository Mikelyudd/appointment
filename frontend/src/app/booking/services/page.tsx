// src/app/booking/services/page.tsx
'use client';

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { useBooking } from '@/contexts/BookingContext';
import { serviceApi } from '@/services/api';
import { BookingSteps } from '@/components/booking/steps/booking-steps';
import { PageHeader } from '@/components/booking/steps/page-header';
import { ServiceOptionModal } from '@/components/booking/services/service-option-modal';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Check, Plus } from "lucide-react";
import type { Service } from '@/types';

// 定义服务类别
const categories = ["Body Treatment", "Facial Treatment", "Massage", "Special Care"];

// 商店信息可以之后从后端获取
const shopInfo = {
    name: "Beauty & Wellness Center",
    address: "123 Main Street, City",
    phone: "(123) 456-7890"
};

export default function ServicesPage() {
    const router = useRouter();
    const { dispatch } = useBooking();
    const [selectedServiceId, setSelectedServiceId] = useState<string>();
    const [selectedCategory, setSelectedCategory] = useState("Body Treatment");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadServices() {
            try {
                setError(null);
                // 使用固定的测试 shopId
                const shopId = 'aec0c125-1c74-487f-8b6d-4ce0125384a2';
                console.log('Loading services for shop:', shopId);
                const data = await serviceApi.getServices(shopId);
                console.log('Loaded services:', data);
                if (Array.isArray(data)) {
                    setServices(data);
                } else {
                    console.error('Invalid services data:', data);
                    setError('Invalid services data received');
                }
            } catch (error) {
                console.error('Failed to load services:', error);
                setError('Failed to load services. Please try again.');
            } finally {
                setLoading(false);
            }
        }

        loadServices();
    }, []);

    const handleServiceClick = (service: Service) => {
        setSelectedServiceId(service.id);
        setSelectedService(service);
        setIsModalOpen(true);
    };

    const handleOptionSelect = (option: {
        id: string;
        name: string;
        duration: string;
        price: number;
        type?: string;
    }) => {
        if (selectedService) {
            dispatch({
                type: 'SELECT_SERVICE',
                payload: {
                    ...selectedService,
                    name: option.name,
                    price: option.price,
                    type: option.type
                }
            });
            setIsModalOpen(false);
            router.push('/booking/resource');
        }
    };

    // 暂时所有服务都显示在一个类别下
    const filteredServices = services;

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            {/* Progress Steps */}
            <div className="mb-8">
                <BookingSteps />
            </div>

            <PageHeader
                title="Select Service"
                description="Choose the service you'd like to book"
            />

            <div className="flex justify-between items-start">
                <div className="flex-1 max-w-4xl">
                    {/* Category Navigation */}
                    <div className="relative mb-8">
                        <div className="flex items-center gap-2">
                            <button className="p-2 hover:bg-gray-100 rounded-full">
                                <ChevronLeft className="w-5 h-5 text-gray-400" />
                            </button>
                            <div className="flex gap-2 overflow-x-auto pb-2">
                                {categories.map((category) => (
                                    <Button
                                        key={category}
                                        variant={category === selectedCategory ? "default" : "secondary"}
                                        onClick={() => setSelectedCategory(category)}
                                        className="rounded-full px-6"
                                    >
                                        {category}
                                    </Button>
                                ))}
                            </div>
                            <button className="p-2 hover:bg-gray-100 rounded-full">
                                <ChevronRight className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>
                    </div>

                    {/* Service List */}
                    <div className="space-y-4">
                        {filteredServices.map((service) => (
                            <Card
                                key={service.id}
                                className="p-6 hover:shadow-md transition-all cursor-pointer border border-gray-200"
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-lg font-semibold">{service.name}</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-sm text-gray-500">
                                                {service.duration} minutes
                                            </span>
                                            <span className="text-sm font-medium">
                                                ${service.price}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-4">
                                            {service.description}
                                        </p>
                                    </div>
                                    <button 
                                        className="rounded-full w-8 h-8 flex items-center justify-center border border-primary/30 hover:bg-primary/5"
                                        onClick={() => handleServiceClick(service)}
                                    >
                                        {selectedServiceId === service.id ? (
                                            <Check className="w-5 h-5 text-primary" />
                                        ) : (
                                            <Plus className="w-5 h-5 text-gray-400" />
                                        )}
                                    </button>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Right Sidebar */}
                <div className="w-80 ml-8 sticky top-8">
                    <Card className="p-6">
                        <h2 className="text-xl font-semibold text-center">
                            {shopInfo.name}
                        </h2>
                        <p className="text-sm text-gray-500 text-center mt-2">
                            {shopInfo.address}
                        </p>
                        <p className="text-sm text-gray-500 text-center mt-1">
                            {shopInfo.phone}
                        </p>
                        <div className="mt-6 pt-6 border-t">
                            <p className="text-sm text-gray-500 text-center">
                                {selectedServiceId 
                                    ? services.find(s => s.id === selectedServiceId)?.name
                                    : 'No service selected'}
                            </p>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Service Options Modal */}
            {selectedService && (
                <ServiceOptionModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSelect={handleOptionSelect}
                    service={{
                        name: selectedService.name,
                        duration: `${selectedService.duration} min`,
                        description: selectedService.description,
                        price: selectedService.price
                    }}
                />
            )}
        </div>
    );
}
