'use client';

import { useEffect, useState } from 'react';
import { getUserAppointments, updateAppointmentStatus } from '@/app/actions/booking';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
    Dialog, 
    DialogContent, 
    DialogDescription, 
    DialogHeader, 
    DialogTitle 
} from '@/components/ui/dialog';
import { Loader2, Calendar, Clock, MapPin, XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import moment from 'moment';
import { Badge } from '@/components/ui/badge';

export default function AppointmentsPage() {
    const router = useRouter();
    const [appointments, setAppointments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedAppointment, setSelectedAppointment] = useState<any | null>(null);
    const [isCancelling, setIsCancelling] = useState(false);
    const [phone, setPhone] = useState<string | null>(null);

    useEffect(() => {
        const storedPhone = typeof window !== 'undefined' ? localStorage.getItem('guestPhone') : null;
        setPhone(storedPhone);
        if (storedPhone) {
            loadAppointments(storedPhone);
        } else {
            setLoading(false);
        }
    }, []);

    const loadAppointments = async (targetPhone: string) => {
        try {
            setLoading(true);
            const response = await getUserAppointments(targetPhone);
            if (response.success) {
                setAppointments(response.data as any);
            }
        } catch (error) {
            setError('Failed to load appointments');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (appointmentId: string) => {
        try {
            setIsCancelling(true);
            const response = await updateAppointmentStatus(appointmentId, 'CANCELLED');
            if (response.success && phone) {
                await loadAppointments(phone);
                setSelectedAppointment(null);
            }
        } catch (error) {
            setError('Failed to cancel appointment');
        } finally {
            setIsCancelling(false);
        }
    };

    if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-yellow-600" /></div>;

    if (!phone) {
        return (
            <div className="flex flex-col items-center justify-center h-screen space-y-4 px-4 text-center">
                <div className="bg-yellow-50 p-6 rounded-full">
                    <Calendar className="w-12 h-12 text-yellow-600" />
                </div>
                <h2 className="text-2xl font-bold">Track Your Appointments</h2>
                <p className="text-gray-500 max-w-sm">Enter your phone number to view and manage all your bookings across GoldEngine shops.</p>
                <Button onClick={() => router.push('/')} className="bg-yellow-600">Go to Home</Button>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold mb-2">My Appointments</h1>
            <p className="text-gray-500 mb-8">Registered for: <span className="font-semibold text-gray-800">{phone}</span></p>

            <div className="space-y-4">
                {appointments.map((appt) => (
                    <Card key={appt.id} className="overflow-hidden border-l-4 border-l-yellow-600">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start">
                                <div className="space-y-3">
                                    <div>
                                        <Badge variant={appt.status === 'CONFIRMED' ? 'default' : 'secondary'} className={appt.status === 'CONFIRMED' ? 'bg-green-100 text-green-700 hover:bg-green-100' : ''}>
                                            {appt.status}
                                        </Badge>
                                        <h3 className="text-xl font-bold mt-2">{appt.optionName || appt.service?.name}</h3>
                                    </div>
                                    
                                    <div className="space-y-1 text-sm text-gray-600">
                                        <div className="flex items-center"><Calendar className="w-4 h-4 mr-2" /> {moment(appt.date).format('dddd, MMMM D, YYYY')}</div>
                                        <div className="flex items-center"><Clock className="w-4 h-4 mr-2" /> {moment(appt.startTime, 'HH:mm').format('h:mm A')}</div>
                                        <div className="flex items-center"><MapPin className="w-4 h-4 mr-2" /> {appt.shop?.name}</div>
                                    </div>
                                </div>

                                {appt.status === 'CONFIRMED' && (
                                    <Button variant="ghost" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => setSelectedAppointment(appt)}>
                                        <XCircle className="w-5 h-5 mr-2" /> Cancel
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {appointments.length === 0 && (
                    <div className="text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed">
                        <p className="text-gray-500 text-lg">No appointments found for this number.</p>
                        <Button variant="link" onClick={() => router.push('/')} className="text-yellow-700 mt-2">Book your first service</Button>
                    </div>
                )}
            </div>

            <Dialog open={!!selectedAppointment} onOpenChange={() => setSelectedAppointment(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Cancel Appointment?</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to cancel your appointment at <strong>{selectedAppointment?.shop?.name}</strong>? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end gap-3 mt-6">
                        <Button variant="outline" onClick={() => setSelectedAppointment(null)}>Keep it</Button>
                        <Button variant="destructive" onClick={() => handleCancel(selectedAppointment.id)} disabled={isCancelling}>
                            {isCancelling ? 'Processing...' : 'Yes, Cancel'}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
