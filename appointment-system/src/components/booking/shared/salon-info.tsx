// src/components/booking/shared/salon-info.tsx
import { Card } from "@/components/ui/card";
import { MapPin, Phone } from "lucide-react";

interface SalonInfoProps {
    name: string;
    address: string;
    phone: string;
}

export function SalonInfo({ name, address, phone }: SalonInfoProps) {
    return (
        <Card className="p-4">
            <div className="text-center space-y-2">
                <h2 className="font-bold text-lg">{name}</h2>
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                    <MapPin className="w-4 h-4" />
                    <span>{address}</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                    <Phone className="w-4 h-4" />
                    <span>{phone}</span>
                </div>
            </div>
        </Card>
    );
}
