'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
    const router = useRouter();
    const { state } = useAuth();

    useEffect(() => {
        if (!state.loading && !state.token) {
            router.replace('/auth/login');
        }
    }, [state.loading, state.token, router]);

    // 如果正在加载，显示加载状态
    if (state.loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    // 如果没有token，不渲染任何内容（等待重定向）
    if (!state.token) {
        return null;
    }

    // 如果有token，渲染子组件
    return <>{children}</>;
} 