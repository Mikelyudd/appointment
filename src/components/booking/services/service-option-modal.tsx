// src/components/booking/services/service-option-modal.tsx
import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import {
    Card,
    CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ServiceOption {
    id: string;
    name: string;
    duration: string;
    description?: string;
    type?: string;
    price?: number;
}

export interface ServiceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (option: ServiceOption) => void;
    service: {
        name: string;
        duration: string;
        description: string;
        price?: number;
    };
}

export function ServiceOptionModal({
                                       isOpen,
                                       onClose,
                                       onSelect,
                                       service
                                   }: ServiceModalProps) {
    const [selectedOptionId, setSelectedOptionId] = useState<string>("");

    const serviceOptions: ServiceOption[] = [
        {
            id: "1",
            name: "1 Time Meridian's Set",
            duration: "1 hour",
            price: 89.99
        },
        {
            id: "2",
            name: "40 Times Meridians Set",
            duration: "1 hour",
            type: "Annual Pass",
            price: 2999.99
        },
        {
            id: "3",
            name: "10 Times Meridian Set",
            duration: "1 hour",
            price: 799.99
        }
    ];

    const handleOptionSelect = (option: ServiceOption) => {
        setSelectedOptionId(option.id);
        onSelect(option);
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(price);
    };

    return (
        <Dialog open={isOpen} onOpenChange={() => onClose()}>
            <DialogContent className="max-w-xl">
                <DialogHeader>
                    <div className="flex justify-between items-start">
                        <DialogTitle>{service.name}</DialogTitle>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={onClose}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </DialogHeader>

                <div className="space-y-6">
                    <div>
                        <p className="text-sm text-muted-foreground">{service.duration}</p>
                        <DialogDescription className="mt-2">
                            {service.description}
                        </DialogDescription>
                    </div>

                    <div>
                        <h3 className="font-medium mb-4">Select an option</h3>
                        <p className="text-sm text-muted-foreground mb-4">Choose one</p>
                        <div className="space-y-3">
                            {serviceOptions.map((option) => (
                                <Card
                                    key={option.id}
                                    className={cn(
                                        "cursor-pointer transition-colors hover:border-primary",
                                        selectedOptionId === option.id && "border-primary bg-primary/5"
                                    )}
                                    onClick={() => handleOptionSelect(option)}
                                >
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-1">
                                                <h4 className="font-medium">{option.name}</h4>
                                                <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            {option.duration}
                          </span>
                                                    {option.type && (
                                                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                              {option.type}
                            </span>
                                                    )}
                                                </div>
                                                {option.price && (
                                                    <div className="text-sm font-medium">
                                                        {formatPrice(option.price)}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="h-4 w-4 rounded-full border border-primary flex items-center justify-center">
                                                {selectedOptionId === option.id && (
                                                    <div className="h-2 w-2 rounded-full bg-primary" />
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
