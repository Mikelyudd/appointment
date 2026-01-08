// src/components/booking/confirm/confirmation-dialog.tsx
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

interface ConfirmationDialogProps {
    open: boolean;
    onClose: () => void;
    appointmentId: string | null;
}

export function ConfirmationDialog({ open, onClose, appointmentId }: ConfirmationDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                        <CheckCircle2 className="h-6 w-6 text-green-600" />
                    </div>
                    <DialogTitle className="text-center">Booking Confirmed!</DialogTitle>
                    <DialogDescription className="text-center">
                        Your appointment has been successfully booked.
                        {appointmentId && (
                            <div className="mt-2">
                                Booking reference: {appointmentId}
                            </div>
                        )}
                    </DialogDescription>
                </DialogHeader>
                <div className="flex justify-center mt-4">
                    <Button onClick={onClose}>Done</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
