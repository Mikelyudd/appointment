'use server'

import prisma from '@/lib/prisma'
import { AppointmentStatus, VerificationStatus } from '@prisma/client'
import { revalidatePath } from 'next/cache'

// 1. 获取全平台商家列表
export async function getShops() {
  try {
    const shops = await prisma.shop.findMany({
      orderBy: { name: 'asc' }
    })
    return { success: true, data: shops }
  } catch (error) {
    console.error('Error fetching shops:', error)
    return { success: false, error: 'Failed to fetch shops' }
  }
}

// 1.5 根据短码 (shortCode/slug) 获取商家信息
export async function getShopByCode(code: string) {
  try {
    const shop = await prisma.shop.findUnique({
      where: { slug: code }
    })
    if (!shop) return { success: false, error: 'Shop not found' }
    return { success: true, data: shop }
  } catch (error) {
    console.error('Error fetching shop by code:', error)
    return { success: false, error: 'Failed to fetch shop' }
  }
}

// 2. 获取指定商家的服务列表 (包含选项)
export async function getServices(shopId: string) {
  try {
    const services = await prisma.service.findMany({
      where: { shopId },
      include: {
        options: {
          orderBy: { price: 'asc' }
        }
      },
      orderBy: { category: 'asc' }
    })
    return { success: true, data: services }
  } catch (error: any) {
    console.error('Detailed Error in getServices:', error)
    return { 
      success: false, 
      error: `Database Error: ${error.message || 'Unknown error'}` 
    }
  }
}

// 3. 获取指定商家的可用时间段
export async function getTimeSlots(shopId: string, dateStr: string) {
  try {
    const date = new Date(dateStr)
    const slots = await prisma.timeSlot.findMany({
      where: {
        shopId,
        date: {
          gte: new Date(date.setHours(0, 0, 0, 0)),
          lt: new Date(date.setHours(23, 59, 59, 999))
        },
        isAvailable: true
      },
      orderBy: { startTime: 'asc' }
    })

    return {
      morning: slots.filter(s => s.timeOfDay === 'MORNING'),
      afternoon: slots.filter(s => s.timeOfDay === 'AFTERNOON'),
      evening: slots.filter(s => s.timeOfDay === 'EVENING')
    }
  } catch (error) {
    console.error('Error fetching time slots:', error)
    throw new Error('Failed to fetch time slots')
  }
}

// 4. 发送验证码
export async function sendVerificationCode(phone: string) {
  try {
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    await prisma.verification.create({
      data: { phone, code, status: VerificationStatus.PENDING }
    })
    console.log(`[Verification] Code for ${phone}: ${code}`)
    return { success: true }
  } catch (error) {
    console.error('Error sending code:', error)
    return { success: false, error: 'Failed to send verification code' }
  }
}

// 5. 验证并创建预约 (支持服务选项)
export async function verifyAndCreateAppointment(data: {
  phone: string
  code: string
  shopId: string
  serviceId: string
  timeSlotId: string
  customerName: string
  customerEmail?: string
  notes?: string
  price?: number       
  optionName?: string  
  optionId?: string    
}) {
  try {
    if (data.code !== 'LOGGED_IN') {
      const verification = await prisma.verification.findFirst({
        where: {
          phone: data.phone,
          code: data.code,
          status: VerificationStatus.PENDING,
          createdAt: { gte: new Date(Date.now() - 5 * 60 * 1000) }
        },
        orderBy: { createdAt: 'desc' }
      })

      if (!verification) return { success: false, error: 'Invalid or expired verification code' }

      await prisma.verification.update({
        where: { id: verification.id },
        data: { status: VerificationStatus.VERIFIED, verifiedAt: new Date() }
      })
    }

    const timeSlot = await prisma.timeSlot.findUnique({ where: { id: data.timeSlotId } })
    if (!timeSlot || !timeSlot.isAvailable) return { success: false, error: 'This time slot is no longer available' }

    const result = await prisma.$transaction(async (tx) => {
      await tx.timeSlot.update({ where: { id: data.timeSlotId }, data: { isAvailable: false } })
      return await tx.appointment.create({
        data: {
          shopId: data.shopId,
          serviceId: data.serviceId,
          serviceOptionId: data.optionId,
          optionName: data.optionName,
          price: data.price,
          timeSlotId: data.timeSlotId,
          customerName: data.customerName,
          customerPhone: data.phone,
          customerEmail: data.customerEmail,
          notes: data.notes,
          status: AppointmentStatus.CONFIRMED,
          date: timeSlot.date,
          startTime: timeSlot.startTime,
          endTime: timeSlot.endTime
        }
      })
    })

    revalidatePath('/profile/appointments')
    revalidatePath('/admin/appointments')
    return { success: true, data: result }
  } catch (error) {
    console.error('Error creating appointment:', error)
    return { success: false, error: 'Failed to create appointment' }
  }
}

// 6. 获取用户预约列表
export async function getUserAppointments(phone: string) {
  try {
    const appointments = await prisma.appointment.findMany({
      where: { customerPhone: phone },
      include: { service: true, shop: true },
      orderBy: { createdAt: 'desc' }
    })
    return { success: true, data: appointments }
  } catch (error) {
    console.error('Error fetching user appointments:', error)
    return { success: false, error: 'Failed to fetch appointments' }
  }
}

// 7. 更新预约状态
export async function updateAppointmentStatus(appointmentId: string, status: AppointmentStatus) {
  try {
    const appointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: { status }
    })

    if (status === AppointmentStatus.CANCELLED) {
      await prisma.timeSlot.update({
        where: { id: appointment.timeSlotId },
        data: { isAvailable: true }
      })
    }

    revalidatePath('/profile/appointments')
    revalidatePath('/admin/appointments')
    return { success: true, data: appointment }
  } catch (error) {
    console.error('Error updating appointment status:', error)
    return { success: false, error: 'Failed to update appointment' }
  }
}

// 8. 管理员获取所有预约 (支持按店铺过滤)
export async function getAllAppointments(shopId?: string) {
  try {
    const where = shopId ? { shopId } : {};
    const appointments = await prisma.appointment.findMany({
      where,
      include: { service: true, shop: true },
      orderBy: { date: 'desc' }
    })
    return { success: true, data: appointments }
  } catch (error) {
    console.error('Error fetching all appointments:', error)
    return { success: false, error: 'Failed to fetch appointments' }
  }
}

// 9. 管理员获取仪表盘统计数据 (支持按店铺过滤)
export async function getAdminStats(shopId?: string) {
  try {
    const where = shopId ? { shopId } : {};
    const [totalAppointments, totalServices, confirmedAppointments] = await Promise.all([
      prisma.appointment.count({ where }),
      prisma.service.count({ where }),
      prisma.appointment.count({ where: { ...where, status: 'CONFIRMED' } }),
    ]);

    const appointmentsWithPrice = await prisma.appointment.findMany({
      where: { ...where, status: 'CONFIRMED' },
      include: { service: true }
    });
    const totalRevenue = appointmentsWithPrice.reduce((sum, appt) => sum + Number(appt.price || appt.service.price), 0);

    return {
      success: true,
      data: {
        totalAppointments,
        totalServices,
        totalRevenue,
        completionRate: totalAppointments > 0 ? Math.round((confirmedAppointments / totalAppointments) * 100) : 0
      }
    }
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return { success: false, error: 'Failed to fetch stats' }
  }
}

// 10. 管理员创建服务
export async function createService(data: {
  shopId: string;
  name: string;
  duration: number;
  price: number;
  category?: string;
  description?: string;
}) {
  try {
    const service = await prisma.service.create({
      data: {
        shopId: data.shopId,
        name: data.name,
        duration: data.duration,
        price: data.price,
        category: data.category || "Body Treatment",
        description: data.description || "",
      },
    });
    revalidatePath('/admin/services');
    return { success: true, data: service };
  } catch (error) {
    console.error('Error creating service:', error);
    return { success: false, error: 'Failed to create service' };
  }
}

// 11. 管理员删除服务
export async function deleteService(serviceId: string) {
  try {
    await prisma.service.delete({ where: { id: serviceId } });
    revalidatePath('/admin/services');
    return { success: true };
  } catch (error) {
    console.error('Error deleting service:', error);
    return { success: false, error: 'Failed to delete service' };
  }
}

// 12. 获取店铺设置
export async function getShopSettings(shopId: string) {
  try {
    const shop = await prisma.shop.findUnique({ where: { id: shopId } });
    return { success: true, data: shop };
  } catch (error) {
    console.error('Error fetching shop settings:', error);
    return { success: false, error: 'Failed to fetch shop settings' };
  }
}

// 13. 更新店铺设置
export async function updateShopSettings(shopId: string, data: {
  name?: string;
  address?: string;
  phone?: string;
  workingHours?: any;
}) {
  try {
    const shop = await prisma.shop.update({
      where: { id: shopId },
      data: {
        name: data.name,
        address: data.address,
        phone: data.phone,
        workingHours: data.workingHours,
      }
    });
    revalidatePath('/admin/settings');
    revalidatePath(`/s/${shop.slug}/services`);
    return { success: true, data: shop };
  } catch (error) {
    console.error('Error updating shop settings:', error);
    return { success: false, error: 'Failed to update shop settings' };
  }
}

// 14. 添加服务选项
export async function addServiceOption(data: {
  serviceId: string;
  name: string;
  duration: number;
  price: number;
  type?: string;
}) {
  try {
    const option = await prisma.serviceOption.create({
      data: {
        serviceId: data.serviceId,
        name: data.name,
        duration: data.duration,
        price: data.price,
        type: data.type,
      },
    });
    revalidatePath('/admin/services');
    return { success: true, data: option };
  } catch (error) {
    console.error('Error adding service option:', error);
    return { success: false, error: 'Failed to add option' };
  }
}

// 15. 删除服务选项
export async function deleteServiceOption(optionId: string) {
  try {
    await prisma.serviceOption.delete({ where: { id: optionId } });
    revalidatePath('/admin/services');
    return { success: true };
  } catch (error) {
    console.error('Error deleting service option:', error);
    return { success: false, error: 'Failed to delete option' };
  }
}
