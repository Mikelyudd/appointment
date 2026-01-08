'use client';

import {
    createContext,
    useContext,
    useReducer,
    useEffect,
    ReactNode
} from 'react';
import apiClient from '@/lib/api-client';

// 定义用户类型
interface User {
    id: string;
    email: string;
    name: string;
    phone?: string;
    role: 'user' | 'admin';
}

// 定义认证状态
interface AuthState {
    user: User | null;
    token: string | null;
    loading: boolean;
    error: string | null;
}

// 定义认证动作
type AuthAction =
    | { type: 'LOGIN_START' }
    | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
    | { type: 'LOGIN_FAILURE'; payload: string }
    | { type: 'LOGOUT' }
    | { type: 'UPDATE_USER'; payload: User }
    | { type: 'CLEAR_ERROR' };

// 初始状态
const initialState: AuthState = {
    user: null,
    token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
    loading: false,
    error: null,
};

// 创建上下文
const AuthContext = createContext<{
    state: AuthState;
    login: (email: string, password: string, existingToken?: string) => Promise<void>;
    register: (data: { email: string; password: string; name: string; phone?: string }) => Promise<void>;
    logout: () => void;
    updateUser: (data: { name: string; email: string; phone?: string }) => Promise<void>;
    clearError: () => void;
} | null>(null);

// 认证状态reducer
function authReducer(state: AuthState, action: AuthAction): AuthState {
    switch (action.type) {
        case 'LOGIN_START':
            return {
                ...state,
                loading: true,
                error: null,
            };
        case 'LOGIN_SUCCESS':
            return {
                ...state,
                user: action.payload.user,
                token: action.payload.token,
                loading: false,
                error: null,
            };
        case 'LOGIN_FAILURE':
            return {
                ...state,
                user: null,
                token: null,
                loading: false,
                error: action.payload,
            };
        case 'LOGOUT':
            return {
                ...state,
                user: null,
                token: null,
                loading: false,
                error: null,
            };
        case 'UPDATE_USER':
            return {
                ...state,
                user: action.payload,
            };
        case 'CLEAR_ERROR':
            return {
                ...state,
                error: null,
            };
        default:
            return state;
    }
}

// 认证提供者组件
export function AuthProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(authReducer, initialState);

    // 在组件挂载时检查本地存储的token
    useEffect(() => {
        const token = localStorage.getItem('token');
        const tokenExpiresAt = localStorage.getItem('tokenExpiresAt');

        if (token && tokenExpiresAt) {
            const now = new Date().getTime();
            const expiresAt = parseInt(tokenExpiresAt);

            // 如果token未过期
            if (now < expiresAt) {
                // 获取用户信息
                apiClient.get('/profile')
                    .then(response => {
                        dispatch({
                            type: 'LOGIN_SUCCESS',
                            payload: { user: response.data, token }
                        });
                    })
                    .catch(() => {
                        localStorage.removeItem('token');
                        localStorage.removeItem('tokenExpiresAt');
                    });
            } else {
                // 如果token已过期，清除本地存储
                localStorage.removeItem('token');
                localStorage.removeItem('tokenExpiresAt');
            }
        }
    }, []);

    // 登录方法
    const login = async (email: string, password: string, existingToken?: string) => {
        try {
            dispatch({ type: 'LOGIN_START' });
            
            let user;
            let token;

            if (existingToken) {
                // 如果已有token，直接使用
                token = existingToken;
                const response = await apiClient.get('/profile', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                user = response.data;
            } else {
                // 否则进行正常的登录流程
                const response = await apiClient.post('/auth/login', { email, password });
                user = response.data.user;
                token = response.data.token;
            }
            
            // 保存token和过期时间到本地存储
            const expiresAt = new Date().getTime() + 60 * 60 * 1000; // 1小时后过期
            localStorage.setItem('token', token);
            localStorage.setItem('tokenExpiresAt', expiresAt.toString());
            
            dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token } });
        } catch (error: any) {
            dispatch({
                type: 'LOGIN_FAILURE',
                payload: error.response?.data?.error || 'Login failed, please try again',
            });
            throw error;
        }
    };

    // 注册方法
    const register = async (data: { email: string; password: string; name: string; phone?: string }) => {
        try {
            dispatch({ type: 'LOGIN_START' });
            const response = await apiClient.post('/auth/register', data);
            const { user, token } = response.data;
            
            // 保存token到本地存储
            localStorage.setItem('token', token);
            
            dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token } });
        } catch (error: any) {
            dispatch({
                type: 'LOGIN_FAILURE',
                payload: error.response?.data?.error || '注册失败，请稍后重试',
            });
        }
    };

    // 更新用户信息
    const updateUser = async (data: { name: string; email: string; phone?: string }) => {
        try {
            const response = await apiClient.put('/profile', data);
            dispatch({ type: 'UPDATE_USER', payload: response.data });
        } catch (error: any) {
            throw error;
        }
    };

    // 登出方法
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('tokenExpiresAt');
        dispatch({ type: 'LOGOUT' });
    };

    // 清除错误方法
    const clearError = () => {
        dispatch({ type: 'CLEAR_ERROR' });
    };

    return (
        <AuthContext.Provider
            value={{
                state,
                login,
                register,
                logout,
                updateUser,
                clearError,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

// 自定义hook用于访问认证上下文
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
} 