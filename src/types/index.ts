export interface ServiceOption {
    id: string;
    name: string;
    description?: string;
    duration: number;
    price: number;
    type?: string;
}

export interface Service {
    id: string;
    name: string;
    description: string;
    duration: number;
    price: number;
    category: string;
    shopId: string;
    shopName?: string;
    isAvailable?: boolean;
    options?: ServiceOption[];
}

export interface Specialist {
    id: string;
    name: string;
    code: string;
    avatar?: string;
    isAvailable: boolean;
    shopId: string;
}

export type TimeOfDay = 'MORNING' | 'AFTERNOON' | 'EVENING';

export interface TimeSlot {
    id: string;
    date: string;
    startTime: string;
    endTime: string;
    isAvailable: boolean;
    shopId: string;
    timeOfDay: TimeOfDay;
}

export interface Shop {
    id: string;
    name: string;
    address: string;
    phone: string;
    slug: string;
    workingHours: any;
}
