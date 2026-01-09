'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useBooking } from '@/contexts/BookingContext';
import { useAuth } from '@/contexts/AuthContext';
import { verifyAndCreateAppointment, sendVerificationCode, getShopByCode } from '@/app/actions/booking';
import { BookingSteps } from '@/components/booking/steps/booking-steps';
import { ContactForm } from '@/components/booking/confirm/contact-form';
import moment from 'moment';

export default function ConfirmPage() {
    const router = useRouter();
    const { code } = useParams();
    const { state: bookingState } = useBooking();
    const { state: authState } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [shopInfo, setShopInfo] = useState<any>(null);

    useEffect(() => {
        if (!bookingState.selectedService || !bookingState.selectedTimeSlot) {
            router.replace(`/s/${code}/services`);
            return;
        }

        async function loadShop() {
            if (code) {
                const response = await getShopByCode(code as string);
                if (response.success) setShopInfo(response.data);
            }
        }
        loadShop();
    }, [code, bookingState.selectedService, bookingState.selectedTimeSlot, router]);

    const handleGuestSubmit = async (contactInfo: { phone: string; code: string }) => {
        try {
            setIsSubmitting(true);
            setError(null);
            const response = await verifyAndCreateAppointment({
                phone: contactInfo.phone,
                code: contactInfo.code,
                shopId: bookingState.selectedService!.shopId,
                serviceId: bookingState.selectedService!.id,
                timeSlotId: bookingState.selectedTimeSlot!.id,
                customerName: 'Guest',
                // 传选项信息
                price: Number(bookingState.selectedService!.price),
                optionName: bookingState.selectedService!.name,
                optionId: (bookingState.selectedService as any).optionId
            });

            if (response.success) {
                if (typeof window !== 'undefined') localStorage.setItem('guestPhone', contactInfo.phone);
                router.push('/profile/appointments');
            } else {
                setError(response.error || 'Failed to create appointment');
            }
        } catch (err: any) {
            setError('Failed to create appointment.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!bookingState.selectedService || !bookingState.selectedTimeSlot) return null;

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <BookingSteps current="confirm" />
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Contact Info</h2>
                    <ContactForm onSubmit={handleGuestSubmit} isSubmitting={isSubmitting} error={error} />
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="font-semibold mb-4 text-yellow-700">{shopInfo?.name}</h2>
                    <p className="text-sm text-gray-600">{shopInfo?.address}</p>
                    <div className="border-t pt-4 mt-4 space-y-2">
                        <p className="font-bold text-lg">{bookingState.selectedService.name}</p>
                        <p className="text-sm text-gray-600 font-medium">
                            {moment(bookingState.selectedTimeSlot.date).format('MMM D, YYYY')} @ {moment(bookingState.selectedTimeSlot.startTime, 'HH:mm').format('h:mm A')}
                        </p>
                        <div className="flex justify-between items-center pt-2 border-t">
                            <span className="text-sm text-gray-500">Total Price</span>
                            <span className="text-lg font-bold text-yellow-700">${Number(bookingState.selectedService.price).toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
