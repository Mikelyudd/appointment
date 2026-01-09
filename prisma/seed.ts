import { PrismaClient, TimeOfDay } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding multi-tenant data...')
  
  // 清空所有旧数据
  await prisma.appointment.deleteMany({})
  await prisma.timeSlot.deleteMany({})
  await prisma.serviceOption.deleteMany({})
  await prisma.service.deleteMany({})
  await prisma.user.deleteMany({})
  await prisma.shop.deleteMany({})

  // 1. 创建店铺 A (New Bliss)
  const shopA = await prisma.shop.create({
    data: {
      id: 'aec0c125-1c74-487f-8b6d-4ce0125384a2',
      slug: 'qz7p9m2x8k',
      name: "New Bliss Beauty (Flushing)",
      address: "36-29 Main St, 2FL, Flushing, NY 11354",
      phone: "(646)-661-3666",
      workingHours: [
        { day: 1, open: "09:00", close: "20:00", isOpen: true },
        { day: 2, open: "09:00", close: "20:00", isOpen: true },
        { day: 3, open: "09:00", close: "20:00", isOpen: true },
        { day: 4, open: "09:00", close: "20:00", isOpen: true },
        { day: 5, open: "09:00", close: "20:00", isOpen: true },
        { day: 6, open: "09:00", close: "20:00", isOpen: true },
        { day: 0, open: "09:00", close: "20:00", isOpen: true },
      ]
    }
  })

  // 2. 创建店铺 B (Luxury Spa)
  const shopB = await prisma.shop.create({
    data: {
      id: 'b2d1e3f4-5a6b-7c8d-9e0f-1a2b3c4d5e6f',
      slug: 'nx4v2w9r5j',
      name: "Luxury Spa (Manhattan)",
      address: "123 Madison Ave, New York, NY 10016",
      phone: "(212)-555-0199",
      workingHours: [
        { day: 1, open: "10:00", close: "21:00", isOpen: true },
        { day: 2, open: "10:00", close: "21:00", isOpen: true },
        { day: 3, open: "10:00", close: "21:00", isOpen: true },
        { day: 4, open: "10:00", close: "21:00", isOpen: true },
        { day: 5, open: "10:00", close: "21:00", isOpen: true },
        { day: 6, open: "10:00", close: "18:00", isOpen: true },
        { day: 0, open: "00:00", close: "00:00", isOpen: false },
      ]
    }
  })

  // 3. 创建测试账号
  await prisma.user.create({
    data: {
      email: 'admin@goldengine.com',
      name: 'Agency Admin',
      password: 'admin_password_123',
      role: 'SUPER_ADMIN'
    }
  })

  // 4. 为店 A 创建服务和选项
  const serviceA = await prisma.service.create({
    data: {
      shopId: shopA.id,
      name: "Meridian's Set",
      description: "Traditional meridian massage for wellness.",
      duration: 60,
      price: 89.99,
      category: "Body Treatment",
      options: {
        create: [
          { name: "Single Session", duration: 60, price: 89.99 },
          { name: "10-Session Pass", duration: 60, price: 799.00, type: "Package" },
          { name: "Annual Unlimited", duration: 60, price: 2999.00, type: "VIP" }
        ]
      }
    }
  })

  // 5. 创建时间段
  const shops = [shopA, shopB]
  for (const shop of shops) {
    const timeSlots = []
    for (let i = 0; i < 7; i++) {
      const date = new Date()
      date.setDate(date.getDate() + i)
      for (let hour = 10; hour < 18; hour++) {
        timeSlots.push({
          shopId: shop.id,
          date: new Date(date.setHours(0,0,0,0)),
          startTime: `${hour.toString().padStart(2, '0')}:00`,
          endTime: `${(hour + 1).toString().padStart(2, '0')}:00`,
          isAvailable: true,
          timeOfDay: hour < 12 ? 'MORNING' : (hour < 17 ? 'AFTERNOON' : 'EVENING') as TimeOfDay
        })
      }
    }
    await prisma.timeSlot.createMany({ data: timeSlots })
  }

  console.log('Seed multi-tenant data success!')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
