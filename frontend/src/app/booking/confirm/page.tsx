// src/app/booking/confirm/page.tsx
'use client';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useBooking } from '@/contexts/BookingContext';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { BookingSteps } from '@/components/booking/steps/booking-steps';
import { ContactForm } from '@/components/booking/confirm/contact-form';
import moment from 'moment';

// 已登录用户的确认组件
function LoggedInConfirm({ 
    bookingDetails, 
    userInfo, 
    onSubmit, 
    isSubmitting, 
    error 
}: { 
    bookingDetails: any;
    userInfo: { name: string; email: string; phone?: string };
    onSubmit: () => Promise<void>;
    isSubmitting: boolean;
    error: string | null;
}) {
    return (
        <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="font-medium mb-2">Contact Info</h3>
                <p>{userInfo.name}</p>
                <p className="text-gray-600">{userInfo.email}</p>
                {userInfo.phone && <p className="text-gray-600">{userInfo.phone}</p>}
            </div>

            <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                    Add notes
                </label>
                <textarea
                    id="notes"
                    className="w-full p-2 border rounded-md"
                    rows={4}
                    placeholder="Include any comments or requests"
                />
            </div>

            {error && (
                <div className="text-red-600 text-sm">
                    {error}
                </div>
            )}

            <button
                onClick={onSubmit}
                disabled={isSubmitting}
                className="w-full bg-teal-600 text-white py-2 px-4 rounded-md hover:bg-teal-700 disabled:bg-teal-300"
            >
                {isSubmitting ? 'Processing...' : 'Confirm'}
            </button>
        </div>
    );
}

export default function ConfirmPage() {
    const router = useRouter();
    const { state: bookingState } = useBooking();
    const { state: authState, login } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [notes, setNotes] = useState('');

    // 在组件挂载时检查预约信息
    useEffect(() => {
        if (!bookingState.selectedService ||
            !bookingState.selectedSpecialist ||
            !bookingState.selectedTimeSlot) {
            router.replace('/booking/services');
        }
    }, []);

    // 如果没有必要的信息，显示加载状态
    if (!bookingState.selectedService ||
        !bookingState.selectedSpecialist ||
        !bookingState.selectedTimeSlot) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <BookingSteps current="confirm" />
                <div className="text-center">
                    <p className="text-red-600">Please complete your booking selection first</p>
                    <button
                        onClick={() => router.push('/booking/services')}
                        className="mt-4 text-blue-600 hover:text-blue-800"
                    >
                        Start booking
                    </button>
                </div>
            </div>
        );
    }

    // 确保所有必要的信息都存在
    const service = bookingState.selectedService!;
    const specialist = bookingState.selectedSpecialist!;
    const timeSlot = bookingState.selectedTimeSlot!;

    const bookingDetails = {
        serviceName: service.name,
        duration: `${service.duration} min`,
        specialist: specialist.name,
        date: moment(timeSlot.date).format('dddd, MMMM D, YYYY'),
        time: moment(timeSlot.startTime, 'HH:mm').format('h:mm A'),
        price: service.price ? `$${service.price.toFixed(2)}` : 'Free'
    };

    // 已登录用户的提交处理
    const handleLoggedInSubmit = async () => {
        try {
            setIsSubmitting(true);
            setError(null);

            await api.createAppointment({
                shopId: service.shopId,
                serviceId: service.id,
                specialistId: specialist.id,
                timeSlotId: timeSlot.id,
                customerName: authState.user?.name || 'Guest',
                customerPhone: authState.user?.phone || '',
                customerEmail: authState.user?.email,
                notes
            });

            router.push('/profile/appointments');
        } catch (err: any) {
            console.error('Error creating appointment:', err);
            setError(err.message || 'Failed to create appointment. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // 未登录用户的提交处理
    const handleGuestSubmit = async (contactInfo: { phone: string; code: string }) => {
        try {
            setIsSubmitting(true);
            setError(null);

            // 先验证验证码
            const verifyResponse = await api.verifyCode(contactInfo.phone, contactInfo.code);
            
            // 如果验证成功，保存token和用户信息
            if (verifyResponse.success && verifyResponse.token) {
                // 使用login方法来处理认证状态
                await login(verifyResponse.user.email, '', verifyResponse.token);
            }

            await api.verifyAndCreateAppointment({
                code: contactInfo.code,
                phone: contactInfo.phone,
                serviceId: service.id,
                specialistId: specialist.id,
                shopId: service.shopId,
                timeSlotId: timeSlot.id,
                customerName: verifyResponse.user?.name || 'Guest',
                customerPhone: contactInfo.phone,
                notes
            });

            router.push('/profile/appointments');
        } catch (err: any) {
            console.error('Error creating appointment:', err);
            setError(err.message || 'Failed to create appointment. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <BookingSteps current="confirm" />

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">
                        {authState.token ? 'Review and confirm' : 'Contact info'}
                    </h2>
                    <p className="text-gray-600 mb-6">
                        {authState.token 
                            ? 'Please review your booking details'
                            : 'Please provide your contact information'
                        }
                    </p>
                    
                    {authState.token ? (
                        <LoggedInConfirm
                            bookingDetails={bookingDetails}
                            userInfo={{
                                name: authState.user?.name || 'Guest',
                                email: authState.user?.email || '',
                                phone: authState.user?.phone
                            }}
                            onSubmit={handleLoggedInSubmit}
                            isSubmitting={isSubmitting}
                            error={error}
                        />
                    ) : (
                        <ContactForm
                            onSubmit={handleGuestSubmit}
                            isSubmitting={isSubmitting}
                            error={error}
                        />
                    )}
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="font-semibold mb-4">{service.shopName || 'New Bliss Beauty'}</h2>
                    <div className="text-sm text-gray-600 space-y-1 mb-4">
                        <p>36-29 Main St, 2FL</p>
                        <p>Flushing, NY 11354, USA</p>
                        <p>(646)-661-3666</p>
                    </div>

                    <div className="border-t pt-4">
                        <div className="flex items-center mb-2">
                            <div className="w-4 h-4 rounded-full border-2 border-teal-600 mr-2"></div>
                            <p>{bookingDetails.date} @ {bookingDetails.time}</p>
                        </div>
                        <p className="text-sm text-gray-600">1 hour duration, ends at {moment(timeSlot.startTime, 'HH:mm').add(service.duration, 'minutes').format('h:mm A')}</p>
                    </div>

                    <div className="border-t pt-4 mt-4">
                        <h3 className="font-medium mb-2">{bookingDetails.serviceName}</h3>
                        <p className="text-sm text-gray-600">1 hour • {bookingDetails.duration}</p>
                        <p className="text-sm text-gray-600">with {bookingDetails.specialist}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
