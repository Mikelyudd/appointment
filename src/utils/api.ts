import axios from 'axios';

// 创建axios实例
export const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// 请求拦截器：添加token
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// 响应拦截器：处理错误
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // 如果是401错误，可能是token过期，清除本地存储并刷新页面
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('tokenExpiresAt');
            window.location.href = '/auth/login';
        }
        return Promise.reject(error);
    }
); 