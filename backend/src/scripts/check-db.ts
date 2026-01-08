import { Shop, Service } from '../models';
import { sequelize } from '../config/database';

async function checkDatabase() {
  try {
    console.log('\n=== 检查商店数据 ===');
    const shops = await Shop.findAll();
    console.log('商店列表:', JSON.stringify(shops, null, 2));

    console.log('\n=== 检查服务数据 ===');
    const services = await Service.findAll({
      include: [{
        model: Shop,
        as: 'shop'
      }]
    });
    console.log('服务列表:', JSON.stringify(services, null, 2));

  } catch (error) {
    console.error('Error checking database:', error);
  } finally {
    await sequelize.close();
  }
}

if (require.main === module) {
  checkDatabase()
    .then(() => {
      console.log('\n数据库检查完成');
      process.exit(0);
    })
    .catch(() => process.exit(1));
} 