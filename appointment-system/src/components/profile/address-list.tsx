'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, MapPin, Star, StarOff, Pencil, Trash } from 'lucide-react';
import apiClient from '@/lib/api-client';

interface Address {
    id: string;
    name: string;
    street: string;
    unit?: string;
    city: string;
    state: string;
    zipCode: string;
    isDefault: boolean;
    instructions?: string;
}

interface AddressListProps {
    onAddNew: () => void;
    onEdit: (address: Address) => void;
}

export function AddressList({ onAddNew, onEdit }: AddressListProps) {
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadAddresses();
    }, []);

    const loadAddresses = async () => {
        try {
            const response = await apiClient.get('/profile/addresses');
            setAddresses(response.data);
        } catch (error: any) {
            setError('Failed to load addresses');
        } finally {
            setLoading(false);
        }
    };

    const handleSetDefault = async (addressId: string) => {
        try {
            await apiClient.put(`/profile/addresses/${addressId}/default`);
            loadAddresses();
        } catch (error: any) {
            setError('Failed to set default address');
        }
    };

    const handleDelete = async (addressId: string) => {
        if (!confirm('Are you sure you want to delete this address?')) {
            return;
        }

        try {
            await apiClient.delete(`/profile/addresses/${addressId}`);
            loadAddresses();
        } catch (error: any) {
            setError('Failed to delete address');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Addresses</h2>
                <Button size="sm" onClick={onAddNew}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Address
                </Button>
            </div>

            {error && (
                <div className="text-sm text-red-500">{error}</div>
            )}

            <div className="grid gap-4">
                {addresses.map((address) => (
                    <Card key={address.id} className="p-4">
                        <div className="flex justify-between">
                            <div className="flex items-start space-x-3">
                                <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                                <div>
                                    <div className="font-medium">{address.name}</div>
                                    <div className="text-sm text-gray-600">
                                        {address.street}
                                        {address.unit && `, ${address.unit}`}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        {address.city}, {address.state} {address.zipCode}
                                    </div>
                                    {address.instructions && (
                                        <div className="text-sm text-gray-500 mt-1">
                                            {address.instructions}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-start space-x-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleSetDefault(address.id)}
                                    disabled={address.isDefault}
                                >
                                    {address.isDefault ? (
                                        <Star className="h-4 w-4 text-yellow-400" />
                                    ) : (
                                        <StarOff className="h-4 w-4" />
                                    )}
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onEdit(address)}
                                >
                                    <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDelete(address.id)}
                                    disabled={address.isDefault}
                                >
                                    <Trash className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </Card>
                ))}

                {addresses.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        No addresses added yet
                    </div>
                )}
            </div>
        </div>
    );
} 