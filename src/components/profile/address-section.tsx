import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { AddressForm } from "./address-form";
import { AddressList } from "./address-list";

export function AddressSection() {
    const [isAddressFormOpen, setIsAddressFormOpen] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState<any>(null);

    const handleAddressFormClose = () => {
        setIsAddressFormOpen(false);
        setSelectedAddress(null);
    };

    return (
        <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold">我的地址</h2>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsAddressFormOpen(true)}
                    className="text-blue-500"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    添加新地址
                </Button>
            </div>

            <AddressList
                onAddNew={() => {
                    setSelectedAddress(null);
                    setIsAddressFormOpen(true);
                }}
                onEdit={(address) => {
                    setSelectedAddress(address);
                    setIsAddressFormOpen(true);
                }}
            />

            <Dialog open={isAddressFormOpen} onOpenChange={setIsAddressFormOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>
                            {selectedAddress ? '编辑地址' : '添加新地址'}
                        </DialogTitle>
                    </DialogHeader>
                    <AddressForm
                        address={selectedAddress}
                        onSuccess={handleAddressFormClose}
                        onCancel={handleAddressFormClose}
                    />
                </DialogContent>
            </Dialog>
        </Card>
    );
} 