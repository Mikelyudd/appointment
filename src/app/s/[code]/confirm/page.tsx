// src/app/booking/confirm/page.tsx
'use client';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useBooking } from '@/contexts/BookingContext';
import { useAuth } from '@/contexts/AuthContext';
import { verifyAndCreateAppointment, sendVerificationCode, getShopBySlug } from '@/app/actions/booking';
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
    const { slug } = useParams();
    const { state: bookingState } = useBooking();
    const { state: authState, login } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [notes, setNotes] = useState('');
    const [shopInfo, setShopInfo] = useState<any>(null);

    // 在组件挂载时检查预约信息
    useEffect(() => {
        if (!bookingState.selectedService ||
            !bookingState.selectedTimeSlot) {
            router.replace(`/shop/${slug}/services`);
        }

        async function loadShop() {
            if (slug) {
                const response = await getShopBySlug(slug as string);
                if (response.success) {
                    setShopInfo(response.data);
                }
            }
        }
        loadShop();
    }, [slug, bookingState.selectedService, bookingState.selectedTimeSlot]);

    // 如果没有必要的信息，显示加载状态
    if (!bookingState.selectedService ||
        !bookingState.selectedTimeSlot) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <BookingSteps current="confirm" />
                <div className="text-center">
                    <p className="text-red-600">Please complete your booking selection first</p>
                    <button
                        onClick={() => router.push(`/shop/${slug}/services`)}
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
    const timeSlot = bookingState.selectedTimeSlot!;

    const bookingDetails = {
        serviceName: service.name,
        duration: `${service.duration} min`,
        date: moment(timeSlot.date).format('dddd, MMMM D, YYYY'),
        time: moment(timeSlot.startTime, 'HH:mm').format('h:mm A'),
        price: service.price ? `$${service.price}` : 'Free'
    };

    // 已登录用户的提交处理
    const handleLoggedInSubmit = async () => {
        try {
            setIsSubmitting(true);
            setError(null);

            await verifyAndCreateAppointment({
                phone: authState.user?.phone || '',
                code: 'LOGGED_IN', // 或者是你的登录验证逻辑
                shopId: service.shopId,
                serviceId: service.id,
                timeSlotId: timeSlot.id,
                customerName: authState.user?.name || 'Guest',
                customerEmail: authState.user?.email || undefined,
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

            const response = await verifyAndCreateAppointment({
                phone: contactInfo.phone,
                code: contactInfo.code,
                shopId: service.shopId,
                serviceId: service.id,
                timeSlotId: timeSlot.id,
                customerName: 'Guest',
                notes
            });

            if (response.success) {
                // 保存手机号到 localStorage，以便在 profile 页面查看
                if (typeof window !== 'undefined') {
                    localStorage.setItem('guestPhone', contactInfo.phone);
                }
                router.push('/profile/appointments');
            } else {
                setError(response.error || 'Failed to create appointment');
            }
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
                    <h2 className="font-semibold mb-4">{shopInfo?.name || 'Loading...'}</h2>
                    <div className="text-sm text-gray-600 space-y-1 mb-4">
                        <p>{shopInfo?.address}</p>
                        <p>{shopInfo?.phone}</p>
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
                        <p className="text-sm text-gray-600">Duration: {bookingDetails.duration}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
