// types/booking.ts

// 商店信息类型
export interface Shop {
  id: string;
  name: string;
  address: string;
  phone: string;
}

// 服务项目类型
export interface Service {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  category: string;
}

// 专家类型
export interface Specialist {
  id: string;          // 唯一标识
  shopId: string;      // 所属商店ID
  name: string;        // 专家姓名
  code: string;        // 专家代码 (如 "S1")
  avatar?: string;     // 头像URL (可选)
  isAvailable: boolean;// 是否可用
  services?: string[]; // 可提供的服务ID列表
  schedule?: {         // 工作时间安排 (可选)
    [key in Weekday]?: WorkingHour;
  };
  description?: string;// 专家介绍 (可选)
  rating?: number;     // 评分 (可选)
  specialties?: string[]; // 专长领域 (可选)
}

// 时间段类型
export interface TimeSlot {
  id: string;
  shopId: string;
  specialistId: string;
  date: string;        // YYYY-MM-DD
  startTime: string;   // HH:mm
  endTime: string;     // HH:mm
  isAvailable: boolean;
  timeOfDay: TimeOfDay;
}

// 预约类型
export interface Appointment {
  id: string;
  shopId: string;
  serviceId: string;
  specialistId: string;
  date: string;         // YYYY-MM-DD
  startTime: string;    // HH:mm
  endTime: string;      // HH:mm
  status: AppointmentStatus;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  notes?: string;
}

// 工作时间类型
export interface WorkingHour {
  start: string;     // HH:mm
  end: string;       // HH:mm
  isOpen: boolean;
}

// 工作日枚举
export type Weekday =
    | 'monday'
    | 'tuesday'
    | 'wednesday'
    | 'thursday'
    | 'friday'
    | 'saturday'
    | 'sunday';

// 时间段枚举
export type TimeOfDay = 'morning' | 'afternoon' | 'evening';

// 预约状态枚举
export type AppointmentStatus =
    | 'pending'    // 待确认
    | 'confirmed'  // 已确认
    | 'cancelled'  // 已取消
    | 'completed'  // 已完成
    | 'no-show';   // 未到店

// 预约步骤状态
export type BookingStepStatus = 'completed' | 'current' | 'upcoming';

// 预约步骤
export interface BookingStep {
  label: string;
  status: BookingStepStatus;
}

// 预约上下文状态
export interface BookingState {
  selectedService?: Service;
  selectedSpecialist?: Specialist;
  selectedDate?: string;
  selectedTimeSlot?: TimeSlot;
  customerInfo?: {
    phone: string;
    email?: string;
    name?: string;
  };
}

// 预约 Action 类型
export type BookingAction =
    | { type: 'SELECT_SERVICE'; payload: Service }
    | { type: 'SELECT_SPECIALIST'; payload: Specialist }
    | { type: 'SELECT_DATE'; payload: string }
    | { type: 'SELECT_TIME_SLOT'; payload: TimeSlot }
    | { type: 'SET_CUSTOMER_INFO'; payload: { phone: string; email?: string; name?: string } }
    | { type: 'RESET' };
