import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function ServiceOptionModal({ isOpen, onClose, onSelect, service }: any) {
    const [selectedId, setSelectedId] = useState("");
    const displayOptions = service.options && service.options.length > 0 
        ? service.options 
        : [{ id: "default", name: service.name, duration: service.duration, price: service.price }];

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-xl">
                <DialogHeader><DialogTitle>{service.name}</DialogTitle></DialogHeader>
                <div className="space-y-6">
                    <DialogDescription>{service.description}</DialogDescription>
                    <div className="space-y-3">
                        <h3 className="font-medium">Choose an option</h3>
                        {displayOptions.map((opt: any) => (
                            <Card key={opt.id} className={cn("cursor-pointer hover:border-yellow-500", selectedId === opt.id && "border-yellow-600 bg-yellow-50")} onClick={() => { setSelectedId(opt.id); onSelect(opt); }}>
                                <CardContent className="p-4 flex justify-between items-center">
                                    <div>
                                        <p className="font-bold">{opt.name}</p>
                                        <p className="text-sm text-gray-500">{opt.duration} mins {opt.type && `• ${opt.type}`}</p>
                                    </div>
                                    <p className="font-bold text-yellow-700">${Number(opt.price).toFixed(2)}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
