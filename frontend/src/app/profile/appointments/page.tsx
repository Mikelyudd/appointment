'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Appointment {
    id: string;
    shopId: string;
    serviceId: string;
    specialistId: string;
    timeSlotId: string;
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    notes?: string;
    status: 'pending' | 'confirmed' | 'cancelled';
    date: string;
    startTime: string;
    endTime: string;
    service?: {
        id: string;
        name: string;
    };
    specialist?: {
        id: string;
        name: string;
    };
    createdAt: string;
    updatedAt: string;
}

export default function AppointmentsPage() {
    const router = useRouter();
    const { state } = useAuth();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
    const [isCancelling, setIsCancelling] = useState(false);
    const [isRescheduling, setIsRescheduling] = useState(false);
    const [guestPhone, setGuestPhone] = useState<string | null>(null);

    useEffect(() => {
        // 在客户端环境中检查 localStorage
        const storedGuestPhone = typeof window !== 'undefined' ? localStorage.getItem('guestPhone') : null;
        setGuestPhone(storedGuestPhone);
    }, []);

    useEffect(() => {
        loadAppointments();
    }, [state.token, guestPhone]);

    const loadAppointments = async () => {
        try {
            setLoading(true);
            setError(null);

            // 获取手机号
            const phone = state.user?.phone || guestPhone;
            if (!phone) {
                setError('请先登录或输入手机号');
                return;
            }

            const data = await api.getAppointments(phone);
            setAppointments(data);
        } catch (error: any) {
            console.error('Failed to load appointments:', error);
            setError('加载预约记录失败');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (appointmentId: string) => {
        try {
            setIsCancelling(true);
            await api.updateAppointmentStatus(appointmentId, 'cancelled');
            await loadAppointments();
            setSelectedAppointment(null);
        } catch (error: any) {
            console.error('Failed to cancel appointment:', error);
            setError('取消预约失败');
        } finally {
            setIsCancelling(false);
        }
    };

    const handleReschedule = (appointment) => {
        setIsRescheduling(true);
        // 保存当前预约信息到 localStorage
        if (typeof window !== 'undefined') {
            localStorage.setItem('rescheduleAppointment', JSON.stringify(appointment));
        }
        // 重定向到预约流程
        router.push('/booking/services');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (!state.token && !guestPhone) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-semibold mb-4">请先登录</h2>
                    <Button onClick={() => router.push('/auth/login')}>
                        去登录
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-2xl font-semibold mb-6">我的预约</h1>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
                    {error}
                </div>
            )}

            <div className="grid gap-6">
                {appointments.map((appointment) => (
                    <Card key={appointment.id} className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-medium">
                                    {appointment.service?.name}
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">
                                    {format(new Date(appointment.date), 'yyyy-MM-dd')} {appointment.startTime}
                                </p>
                                <p className="text-sm text-gray-500">
                                    专家：{appointment.specialist?.name}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                {appointment.status === 'confirmed' && (
                                    <>
                                        <Button
                                            variant="outline"
                                            onClick={() => handleReschedule(appointment)}
                                            disabled={isRescheduling}
                                        >
                                            {isRescheduling ? '处理中...' : '改期'}
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            onClick={() => setSelectedAppointment(appointment)}
                                            disabled={isCancelling}
                                        >
                                            {isCancelling ? '处理中...' : '取消'}
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                    </Card>
                ))}

                {appointments.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        暂无预约记录
                    </div>
                )}
            </div>

            <Dialog
                open={!!selectedAppointment}
                onOpenChange={() => setSelectedAppointment(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>确认取消预约？</DialogTitle>
                        <DialogDescription>
                            取消后将无法恢复，如需重新预约请重新下单。
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end gap-2 mt-4">
                        <Button
                            variant="outline"
                            onClick={() => setSelectedAppointment(null)}
                        >
                            再想想
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => selectedAppointment && handleCancel(selectedAppointment.id)}
                            disabled={isCancelling}
                        >
                            {isCancelling ? '处理中...' : '确认取消'}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
} 