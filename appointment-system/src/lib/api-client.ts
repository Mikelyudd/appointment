import axios from 'axios';

const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// 请求拦截器
apiClient.interceptors.request.use(
    (config) => {
        console.log('=== API Request ===');
        console.log('URL:', config.url);
        console.log('Method:', config.method);
        console.log('Headers:', config.headers);
        console.log('Data:', config.data);
        console.log('Params:', config.params);
        return config;
    },
    (error) => {
        console.error('Request interceptor error:', {
            message: error.message,
            config: error.config,
            stack: error.stack
        });
        return Promise.reject(error);
    }
);

// 响应拦截器
apiClient.interceptors.response.use(
    (response) => {
        console.log('=== API Response ===');
        console.log('Status:', response.status);
        console.log('Status Text:', response.statusText);
        console.log('Headers:', response.headers);
        console.log('Data:', response.data);
        return response;
    },
    (error) => {
        console.error('Response interceptor error:', {
            message: error.message,
            response: error.response ? {
                status: error.response.status,
                statusText: error.response.statusText,
                headers: error.response.headers,
                data: error.response.data
            } : null,
            config: error.config,
            stack: error.stack
        });
        return Promise.reject(error);
    }
);

export default apiClient; 