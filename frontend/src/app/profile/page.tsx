'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChevronLeft, Plus } from 'lucide-react';
import Link from 'next/link';
import { EditProfileForm } from '@/components/profile/edit-profile-form';
import { AddressSection } from '@/components/profile/address-section';
import { PaymentMethodSection } from '@/components/profile/payment-method-section';
import { SocialLoginSection } from '@/components/profile/social-login-section';
import { UserNav } from '@/components/profile/user-nav';

export default function ProfilePage() {
    const { state, logout } = useAuth();
    const [isEditing, setIsEditing] = useState(false);

    if (!state.user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* 顶部导航 */}
            <header className="border-b bg-white">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Link href="/" className="flex items-center text-sm font-medium">
                            <ChevronLeft className="h-4 w-4 mr-1" />
                            返回
                        </Link>
                    </div>
                    <UserNav />
                </div>
            </header>

            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* 左侧个人信息 */}
                    <Card className="p-6">
                        <div className="space-y-6">
                            <div className="flex justify-between items-start">
                                <h2 className="text-2xl font-semibold">{state.user.name}</h2>
                                <Button 
                                    variant="link" 
                                    onClick={() => setIsEditing(true)}
                                    className="text-blue-500"
                                >
                                    编辑基本信息
                                </Button>
                            </div>

                            {isEditing ? (
                                <EditProfileForm
                                    onCancel={() => setIsEditing(false)}
                                    onSuccess={() => setIsEditing(false)}
                                />
                            ) : (
                                <div className="space-y-4">
                                    <div>
                                        <div className="text-sm text-gray-500">姓名</div>
                                        <div>{state.user.name}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-500">手机号码</div>
                                        <div>{state.user.phone || '未设置'}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-500">邮箱地址</div>
                                        <div>{state.user.email}</div>
                                    </div>
                                </div>
                            )}

                            <Button 
                                variant="outline" 
                                className="w-full text-red-500 hover:text-red-600"
                                onClick={logout}
                            >
                                退出登录
                            </Button>
                        </div>
                    </Card>

                    {/* 右侧功能区 */}
                    <div className="md:col-span-2 space-y-8">
                        <AddressSection />
                        <PaymentMethodSection />
                        <SocialLoginSection />
                    </div>
                </div>
            </div>
        </div>
    );
} 