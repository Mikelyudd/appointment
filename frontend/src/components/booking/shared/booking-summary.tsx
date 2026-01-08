// src/components/booking/shared/booking-summary.tsx
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatDate, formatTime } from "@/lib/date-utils";

export interface BookingDetails {
    serviceName?: string;
    duration?: string;
    specialist?: string;
    date?: string;
    time?: string;
    price?: string;
}

interface BookingSummaryProps {
    details: BookingDetails;
    className?: string;
    showTitle?: boolean;
}

export function BookingSummary({
                                   details,
                                   className,
                                   showTitle = true
                               }: BookingSummaryProps) {
    const {
        serviceName,
        duration,
        specialist,
        date,
        time,
        price
    } = details;

    return (
        <Card className={cn("", className)}>
            {showTitle && (
                <CardHeader className="pb-4">
                    <h3 className="font-semibold text-lg">Booking Summary</h3>
                </CardHeader>
            )}
            <CardContent className="space-y-4">
                {/* Service Details */}
                {serviceName && (
                    <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Service</p>
                        <p className="font-medium">{serviceName}</p>
                        {duration && (
                            <p className="text-sm text-muted-foreground">
                                Duration: {duration}
                            </p>
                        )}
                    </div>
                )}

                {/* Specialist */}
                {specialist && (
                    <div className="space-y-1 pt-2 border-t">
                        <p className="text-sm text-muted-foreground">Specialist</p>
                        <p className="font-medium">{specialist}</p>
                    </div>
                )}

                {/* Date & Time */}
                {(date || time) && (
                    <div className="space-y-1 pt-2 border-t">
                        <p className="text-sm text-muted-foreground">Schedule</p>
                        {date && (
                            <p className="font-medium">
                                {formatDate(date)}
                            </p>
                        )}
                        {time && (
                            <p className="text-sm text-muted-foreground">
                                {formatTime(time)}
                            </p>
                        )}
                    </div>
                )}

                {/* Price */}
                {price && (
                    <div className="pt-4 border-t">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Total</span>
                            <span className="font-semibold text-lg">{price}</span>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
