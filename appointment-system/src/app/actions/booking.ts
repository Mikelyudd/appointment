'use server'

import prisma from '@/lib/prisma'
import { AppointmentStatus, VerificationStatus } from '@prisma/client'
import { revalidatePath } from 'next/cache'

// 1. 获取服务列表
export async function getServices(shopId: string) {
  try {
    console.log('Server Action: getServices called with shopId:', shopId)
    const services = await prisma.service.findMany({
      where: { shopId },
      orderBy: { category: 'asc' }
    })
    console.log('Server Action: found services count:', services.length)
    return { success: true, data: services }
  } catch (error: any) {
    console.error('Detailed Error in getServices:', error)
    // 将具体错误信息返回给前端，方便调试
    return { 
      success: false, 
      error: `Database Error: ${error.message || 'Unknown error'}. Check terminal for logs.` 
    }
  }
}

// 2. 获取可用时间段
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

    // 按早中晚分组返回，保持与原有前端组件兼容
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

// 3. 发送验证码 (目前模拟逻辑)
export async function sendVerificationCode(phone: string) {
  try {
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    
    await prisma.verification.create({
      data: {
        phone,
        code,
        status: VerificationStatus.PENDING
      }
    })

    // 在开发环境下，我们直接控制台打印
    console.log(`[Verification] Code for ${phone}: ${code}`)
    
    return { success: true, code } // 生产环境不应返回 code
  } catch (error) {
    console.error('Error sending code:', error)
    return { success: false, error: 'Failed to send verification code' }
  }
}

// 4. 验证并创建预约
export async function verifyAndCreateAppointment(data: {
  phone: string
  code: string
  shopId: string
  serviceId: string
  timeSlotId: string
  customerName: string
  customerEmail?: string
  notes?: string
}) {
  try {
    // 1. 验证验证码 (5分钟内最新的一条)
    const verification = await prisma.verification.findFirst({
      where: {
        phone: data.phone,
        code: data.code,
        status: VerificationStatus.PENDING,
        createdAt: {
          gte: new Date(Date.now() - 5 * 60 * 1000)
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    if (!verification) {
      return { success: false, error: 'Invalid or expired verification code' }
    }

    // 2. 检查时间段是否依然可用
    const timeSlot = await prisma.timeSlot.findUnique({
      where: { id: data.timeSlotId }
    })

    if (!timeSlot || !timeSlot.isAvailable) {
      return { success: false, error: 'This time slot is no longer available' }
    }

    // 3. 开启事务：更新时间段状态并创建预约
    const result = await prisma.$transaction(async (tx) => {
      // 标记时间段已占用
      await tx.timeSlot.update({
        where: { id: data.timeSlotId },
        data: { isAvailable: false }
      })

      // 标记验证码已使用
      await tx.verification.update({
        where: { id: verification.id },
        data: { 
          status: VerificationStatus.VERIFIED,
          verifiedAt: new Date()
        }
      })

      // 创建预约
      return await tx.appointment.create({
        data: {
          shopId: data.shopId,
          serviceId: data.serviceId,
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
    return { success: true, data: result }
  } catch (error) {
    console.error('Error creating appointment:', error)
    return { success: false, error: 'Failed to create appointment' }
  }
}

// 5. 获取用户预约列表
export async function getUserAppointments(phone: string) {
  try {
    const appointments = await prisma.appointment.findMany({
      where: {
        customerPhone: phone
      },
      include: {
        service: true,
        shop: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    return { success: true, data: appointments }
  } catch (error) {
    console.error('Error fetching user appointments:', error)
    return { success: false, error: 'Failed to fetch appointments' }
  }
}

// 6. 更新预约状态 (例如取消)
export async function updateAppointmentStatus(appointmentId: string, status: AppointmentStatus) {
  try {
    const appointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: { status }
    })

    // 如果是取消预约，要把对应的时间段重新设为可用
    if (status === AppointmentStatus.CANCELLED) {
      await prisma.timeSlot.update({
        where: { id: appointment.timeSlotId },
        data: { isAvailable: true }
      })
    }

    revalidatePath('/profile/appointments')
    return { success: true, data: appointment }
  } catch (error) {
    console.error('Error updating appointment status:', error)
    return { success: false, error: 'Failed to update appointment' }
  }
}

// 7. 管理员获取所有预约
export async function getAllAppointments() {
  try {
    const appointments = await prisma.appointment.findMany({
      include: {
        service: true,
        shop: true
      },
      orderBy: {
        date: 'desc'
      }
    })
    return { success: true, data: appointments }
  } catch (error) {
    console.error('Error fetching all appointments:', error)
    return { success: false, error: 'Failed to fetch appointments' }
  }
}

// 8. 管理员获取仪表盘统计数据
export async function getAdminStats() {
  try {
    const totalAppointments = await prisma.appointment.count()
    const totalRevenue = await prisma.appointment.aggregate({
      where: { status: AppointmentStatus.CONFIRMED },
      _sum: {
        // 注意：Prisma Decimal 处理
        // 这里简单返回，实际可能需要更复杂的逻辑
      }
    })
    
    // 简单返回一些统计
    return {
      success: true,
      data: {
        totalAppointments,
        // 其他统计...
      }
    }
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return { success: false, error: 'Failed to fetch stats' }
  }
}
