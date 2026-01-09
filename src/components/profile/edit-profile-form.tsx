'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface EditProfileFormProps {
    onCancel: () => void;
    onSuccess: () => void;
}

export function EditProfileForm({ onCancel, onSuccess }: EditProfileFormProps) {
    const { state, updateUser } = useAuth();
    const [formData, setFormData] = useState({
        name: state.user?.name || '',
        email: state.user?.email || '',
        phone: state.user?.phone || '',
    });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            await updateUser(formData);
            onSuccess();
        } catch (error: any) {
            setError(error.response?.data?.error || 'Update failed. Please try again later.');
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
                <Label htmlFor="name">Name</Label>
                <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Optional"
                />
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
                    {loading ? 'Saving...' : 'Save'}
                </Button>
            </div>
        </form>
    );
} 