import { PrismaClient, TimeOfDay } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding...')
  
  // 清理旧数据
  await prisma.appointment.deleteMany({})
  await prisma.timeSlot.deleteMany({})
  await prisma.service.deleteMany({})
  await prisma.shop.deleteMany({})

  // 1. 创建店铺
  const shop = await prisma.shop.create({
    data: {
      id: 'aec0c125-1c74-487f-8b6d-4ce0125384a2',
      name: "New Bliss Beauty",
      address: "36-29 Main St, 2FL, Flushing, NY 11354",
      phone: "(646)-661-3666",
      workingHours: {
        monday: { isOpen: true, start: '09:00', end: '20:00' },
        tuesday: { isOpen: true, start: '09:00', end: '20:00' },
        wednesday: { isOpen: true, start: '09:00', end: '20:00' },
        thursday: { isOpen: true, start: '09:00', end: '20:00' },
        friday: { isOpen: true, start: '09:00', end: '20:00' },
        saturday: { isOpen: true, start: '09:00', end: '20:00' },
        sunday: { isOpen: true, start: '09:00', end: '20:00' }
      }
    }
  })

  // 2. 创建服务
  await prisma.service.createMany({
    data: [
      {
        shopId: shop.id,
        name: "Meridian's Set",
        description: "This treatment promotes blood circulation and balances 'qi'.",
        duration: 60,
        price: 89.99,
        category: "Body Treatment"
      },
      {
        shopId: shop.id,
        name: "Facial Care",
        description: "Deep cleansing and hydration for your skin.",
        duration: 45,
        price: 65.00,
        category: "Skin Care"
      }
    ]
  })

  // 3. 创建未来 7 天的时间段 (不区分技师)
  const timeSlots = []
  for (let i = 0; i < 7; i++) {
    const date = new Date()
    date.setDate(date.getDate() + i)
    
    // 每天 9:00 到 18:00，每小时一个档位
    for (let hour = 9; hour < 18; hour++) {
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

  await prisma.timeSlot.createMany({
    data: timeSlots
  })

  console.log('Seed data created successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
