import { sequelize } from '../config/database';
import { User, Address, PaymentMethod, Service, Specialist, TimeSlot, Appointment, Verification, VerificationConfig } from '../models';

async function migrate() {
  try {
    // 同步所有模型
    await User.sync({ alter: true });
    await Address.sync({ alter: true });
    await PaymentMethod.sync({ alter: true });
    await Service.sync({ alter: true });
    await Specialist.sync({ alter: true });
    await TimeSlot.sync({ alter: true });
    await Appointment.sync({ alter: true });
    await Verification.sync({ alter: true });
    await VerificationConfig.sync({ alter: true });

    console.log('数据库迁移完成');
    process.exit(0);
  } catch (error) {
    console.error('数据库迁移失败:', error);
    process.exit(1);
  }
}

migrate(); 