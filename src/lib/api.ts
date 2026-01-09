// src/lib/api.ts

import apiClient from './api-client';
import type { Service, Specialist, TimeSlot } from '../types';

export const api = {
    // 获取服务列表
    getServices: async (shopId: string) => {
        const response = await apiClient.get(`/services?shopId=${shopId}`);
        return response.data;
    },

    // 获取专家列表
    getSpecialists: async (shopId: string) => {
        const response = await apiClient.get(`/specialists/shop/${shopId}`);
        return response.data;
    },

    // 生成时间段
    generateTimeSlots: async (data: {
        shopId: string;
        specialistId?: string;
        date: string;
    }) => {
        try {
            console.log('API: Generating time slots:', data);
            const response = await apiClient.post('/timeslots/generate', data);
            console.log('API: Time slots generated:', response.data);
            return response.data;
        } catch (error: any) {
            console.error('API: Error generating time slots:', error);
            throw error;
        }
    },

    // 获取可用时间段
    getTimeSlots: async (shopId: string, date: string, specialistId?: string) => {
        try {
            console.log('API: Getting time slots:', { shopId, date, specialistId });
            const params = new URLSearchParams({ shopId, date });
            if (specialistId) {
                params.append('specialistId', specialistId);
            }
            const response = await apiClient.get(`/timeslots/available?${params}`);
            console.log('API: Time slots retrieved:', response.data);
            return response.data;
        } catch (error: any) {
            console.error('API: Error getting time slots:', error);
            throw error;
        }
    },

    // 验证并创建预约
    verifyAndCreateAppointment: async (data: {
        code: string;
        phone: string;
        serviceId: string;
        specialistId: string;
        shopId: string;
        timeSlotId: string;
        customerName?: string;
        customerPhone?: string;
        customerEmail?: string;
        notes?: string;
    }) => {
        try {
            console.log('API: Creating appointment - Request payload:', {
                ...data,
                requestTime: new Date().toISOString()
            });

            // 验证必填字段
            const requiredFields = ['code', 'phone', 'serviceId', 'specialistId', 'shopId', 'timeSlotId'];
            const missingFields = requiredFields.filter(field => !data[field as keyof typeof data]);

            if (missingFields.length > 0) {
                console.error('API: Missing required fields:', {
                    missingFields,
                    receivedFields: Object.keys(data)
                });
                throw new Error(`缺少必填字段: ${missingFields.join(', ')}`);
            }

            const response = await apiClient.post('/appointments/verify-and-create', {
                ...data,
                customerName: data.customerName || 'Guest',
                customerPhone: data.customerPhone || data.phone
            });
            
            console.log('API: Appointment creation response:', {
                status: response.status,
                data: response.data,
                responseTime: new Date().toISOString()
            });
            
            return response.data;
        } catch (error: any) {
            console.error('API: Appointment creation error:', {
                response: error.response?.data,
                status: error.response?.status,
                error: error.message,
                time: new Date().toISOString()
            });
            if (error.response?.data) {
                throw error.response.data;
            }
            throw error;
        }
    },

    // 创建预约
    createAppointment: async (data: {
        shopId: string;
        serviceId: string;
        specialistId: string;
        timeSlotId: string;
        date: string;
        startTime: string;
        endTime: string;
        customerName: string;
        customerPhone: string;
        customerEmail?: string;
        notes?: string;
    }) => {
        const response = await apiClient.post('/appointments', data);
        return response.data;
    },

    // 获取用户预约列表
    getUserAppointments: async () => {
        const response = await apiClient.get('/appointments');
        return response.data;
    },

    // 消预约
    cancelAppointment: async (appointmentId: string) => {
        const response = await apiClient.put(`/appointments/${appointmentId}/status`, {
            status: 'cancelled'
        });
        return response.data;
    },

    // 登录
    login: async (email: string, password: string) => {
        const response = await apiClient.post('/auth/login', { email, password });
        return response.data;
    },

    // 注册
    register: async (data: {
        email: string;
        password: string;
        name: string;
        phone?: string;
    }) => {
        const response = await apiClient.post('/auth/register', data);
        return response.data;
    },

    // 更新用户信息
    updateProfile: async (data: {
        name?: string;
        email?: string;
        phone?: string;
    }) => {
        const response = await apiClient.put('/profile', data);
        return response.data;
    },

    // 发送验证码
    sendVerificationCode: async (phone: string) => {
        try {
            console.log('API: Sending verification code request for phone:', phone);
            const response = await apiClient.post('/verifications/send', { phone });
            console.log('API: Verification response:', response.data);
            return response.data;
        } catch (error: any) {
            console.error('API: Error sending verification code:', {
                error: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            throw new Error(error.response?.data?.error || error.message);
        }
    },

    // 验证验证码
    verifyCode: async (phone: string, code: string) => {
        try {
            console.log('API: Verifying code - Request payload:', {
                phone,
                code,
                requestTime: new Date().toISOString()
            });
            
            if (!phone || !code) {
                console.error('API: Missing required fields:', {
                    phone: !phone ? 'missing' : 'present',
                    code: !code ? 'missing' : 'present'
                });
                throw new Error('Phone and code are required');
            }

            const response = await apiClient.post('/verifications/verify', {
                phone,
                code
            });
            
            console.log('API: Verification response:', {
                status: response.status,
                data: response.data,
                responseTime: new Date().toISOString()
            });
            
            return response.data;
        } catch (error: any) {
            console.error('API: Verification error:', {
                response: error.response?.data,
                status: error.response?.status,
                error: error.message,
                time: new Date().toISOString()
            });
            if (error.response?.data) {
                throw error.response.data;
            }
            throw error;
        }
    },

    // 获取预约列表
    getAppointments: async (phone: string) => {
        try {
            console.log('API: Getting appointments - Start:', { phone });
            const response = await apiClient.get(`/appointments/user?phone=${encodeURIComponent(phone)}`);
            console.log('API: Getting appointments - Response:', {
                status: response.status,
                data: response.data,
                time: new Date().toISOString()
            });
            return response.data;
        } catch (error: any) {
            console.error('API: Error getting appointments:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                time: new Date().toISOString()
            });
            throw error;
        }
    },

    // 更新预约状态
    updateAppointmentStatus: async (appointmentId: string, status: string) => {
        try {
            console.log('API: Updating appointment status - Start:', {
                appointmentId,
                status,
                time: new Date().toISOString()
            });
            const response = await apiClient.put(`/appointments/${appointmentId}/status`, { status });
            console.log('API: Appointment status updated - Response:', {
                status: response.status,
                data: response.data,
                time: new Date().toISOString()
            });
            return response.data;
        } catch (error: any) {
            console.error('API: Error updating appointment status:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                time: new Date().toISOString()
            });
            throw error;
        }
    }
};
