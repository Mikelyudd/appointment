'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import apiClient from '@/lib/api-client';

interface AddressFormProps {
    address?: {
        id: string;
        name: string;
        street: string;
        unit?: string;
        city: string;
        state: string;
        zipCode: string;
        isDefault: boolean;
        instructions?: string;
    };
    onSuccess: () => void;
    onCancel: () => void;
}

export function AddressForm({ address, onSuccess, onCancel }: AddressFormProps) {
    const [formData, setFormData] = useState({
        name: address?.name || '',
        street: address?.street || '',
        unit: address?.unit || '',
        city: address?.city || '',
        state: address?.state || '',
        zipCode: address?.zipCode || '',
        isDefault: address?.isDefault || false,
        instructions: address?.instructions || '',
    });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCheckboxChange = (checked: boolean) => {
        setFormData(prev => ({
            ...prev,
            isDefault: checked
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            if (address?.id) {
                await apiClient.put(`/profile/addresses/${address.id}`, formData);
            } else {
                await apiClient.post('/profile/addresses', formData);
            }
            onSuccess();
        } catch (error: any) {
            setError(error.response?.data?.error || 'Failed to save address');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <div className="space-y-2">
                <Label htmlFor="name">Address Name</Label>
                <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Home, Office"
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="street">Street Address</Label>
                <Input
                    id="street"
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="unit">Unit/Apt (Optional)</Label>
                <Input
                    id="unit"
                    name="unit"
                    value={formData.unit}
                    onChange={handleChange}
                    placeholder="e.g. Apt 4B"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        required
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="zipCode">ZIP Code</Label>
                <Input
                    id="zipCode"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    pattern="\d{5}(-\d{4})?"
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="instructions">Delivery Instructions (Optional)</Label>
                <Textarea
                    id="instructions"
                    name="instructions"
                    value={formData.instructions}
                    onChange={handleChange}
                    placeholder="e.g. Ring doorbell, call upon arrival"
                    className="h-20"
                />
            </div>

            <div className="flex items-center space-x-2">
                <Checkbox
                    id="isDefault"
                    checked={formData.isDefault}
                    onCheckedChange={handleCheckboxChange}
                />
                <Label htmlFor="isDefault">Set as default address</Label>
            </div>

            <div className="flex justify-end space-x-2">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={loading}
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    disabled={loading}
                >
                    {loading ? 'Saving...' : 'Save Address'}
                </Button>
            </div>
        </form>
    );
} 