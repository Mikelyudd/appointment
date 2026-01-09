import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function test() {
  try {
    const shopCount = await prisma.shop.count()
    const serviceCount = await prisma.service.count()
    console.log('--- Database Check ---')
    console.log('Shops in DB:', shopCount)
    console.log('Services in DB:', serviceCount)
    
    if (shopCount > 0) {
      const shop = await prisma.shop.findFirst()
      console.log('First Shop ID:', shop?.id)
    }
  } catch (e) {
    console.error('Database connection failed:', e)
  } finally {
    await prisma.$disconnect()
  }
}

test()
