'use server'

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

function generateShortCode(length = 10) {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function getAllShops() {
  try {
    const shops = await prisma.shop.findMany({
      include: {
        _count: { select: { services: true, appointments: true } },
        users: { where: { role: 'MERCHANT' } },
        appointments: { where: { status: 'CONFIRMED' } }
      },
      orderBy: { createdAt: 'desc' }
    });
    return { success: true, data: shops };
  } catch (error) {
    return { success: false, error: 'Failed to fetch shops' };
  }
}

const DEFAULT_WORKING_HOURS = [
  { day: 1, open: "09:00", close: "18:00", isOpen: true },
  { day: 2, open: "09:00", close: "18:00", isOpen: true },
  { day: 3, open: "09:00", close: "18:00", isOpen: true },
  { day: 4, open: "09:00", close: "18:00", isOpen: true },
  { day: 5, open: "09:00", close: "18:00", isOpen: true },
  { day: 6, open: "10:00", close: "16:00", isOpen: true },
  { day: 0, open: "00:00", close: "00:00", isOpen: false },
];

export async function onboardShop(data: { name: string, email: string, address?: string, phone?: string }) {
  try {
    const slug = generateShortCode();
    const result = await prisma.$transaction(async (tx) => {
      const shop = await tx.shop.create({
        data: {
          name: data.name,
          slug: slug,
          address: data.address || '',
          phone: data.phone || '',
          workingHours: DEFAULT_WORKING_HOURS,
        }
      });

      const user = await tx.user.create({
        data: {
          email: data.email,
          name: `Admin of ${data.name}`,
          password: 'temp_password_123',
          role: 'MERCHANT',
          shopId: shop.id,
        }
      });

      return { shop, user };
    });

    revalidatePath('/super-admin');
    return { success: true, data: result };
  } catch (error: any) {
    console.error('Onboarding error detailed:', error);
    if (error.code === 'P2002') return { success: false, error: 'Email or Slug already exists' };
    return { success: false, error: error.message || 'Failed to onboard shop' };
  }
}

// 4. 获取全平台顾客列表
export async function getAllCustomers() {
  try {
    const customers = await prisma.appointment.groupBy({
      by: ['customerPhone', 'customerName'],
      _count: { id: true },
      _max: { createdAt: true },
      orderBy: { _max: { createdAt: 'desc' } }
    });

    return { 
      success: true, 
      data: customers.map(c => ({
        phone: c.customerPhone,
        name: c.customerName,
        totalAppointments: c._count.id,
        lastActive: c._max.createdAt
      }))
    };
  } catch (error) {
    console.error('Error fetching customers:', error);
    return { success: false, error: 'Failed to fetch customers' };
  }
}
