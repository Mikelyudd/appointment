export interface User {
    id: string;
    email: string;
    password: string;
    name: string;
    role: 'user' | 'admin';
    createdAt?: Date;
    updatedAt?: Date;
}

export interface Service {
    id: string;
    name: string;
    description: string;
    duration: number;
    price: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface Appointment {
    id: string;
    userId: string;
    serviceId: string;
    startTime: Date;
    endTime: Date;
    status: 'pending' | 'confirmed' | 'cancelled';
    createdAt?: Date;
    updatedAt?: Date;
}

// src/types/booking.ts
export interface LoginInput {
    email: string;
    password: string;
}

export interface RegisterInput extends LoginInput {
    name: string;
}

export interface AuthResponse {
    token: string;
    user: {
        id: string;
        email: string;
        name: string;
        role: string;
    };
}
