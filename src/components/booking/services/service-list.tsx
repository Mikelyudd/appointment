// src/components/booking/services/service-list.tsx
import { Service, ServiceCard } from "./service-card";

interface ServiceListProps {
    services: Service[];
    selectedService?: Service;
    onServiceSelect: (service: Service) => void;
}

export function ServiceList({
                                services,
                                selectedService,
                                onServiceSelect
                            }: ServiceListProps) {
    return (
        <div className="space-y-4">
            {services.map((service) => (
                <ServiceCard
                    key={service.id}
                    service={service}
                    isSelected={selectedService?.id === service.id}
                    onSelect={onServiceSelect}
                />
            ))}
        </div>
    );
}
