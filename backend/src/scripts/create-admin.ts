import { User } from '../models';

async function createAdmin() {
  try {
    const email = 'admin@example.com';
    const password = 'admin123';
    const name = 'Admin';

    console.log('开始创建管理员账号...');

    // 检查是否已存在管理员账号
    const existingAdmin = await User.findOne({
      where: { email, role: 'admin' }
    });

    if (existingAdmin) {
      console.log('管理员账号已存在，删除旧账号...');
      await existingAdmin.destroy();
    }

    // 创建管理员账号
    console.log('创建新管理员账号...');
    const admin = await User.create({
      email,
      password, // 密码会在 beforeCreate hook 中自动加密
      name,
      role: 'admin'
    });

    // 验证密码是否正确保存
    console.log('验证密码...');
    const isValid = await admin.validatePassword(password);
    console.log('密码验证结果:', isValid);

    if (!isValid) {
      throw new Error('密码验证失败，请重新运行脚本');
    }

    console.log('管理员账号创建成功:', {
      email,
      name,
      id: admin.id,
      passwordValid: isValid
    });

    process.exit(0);
  } catch (error) {
    console.error('创建管理员账号失败:', error);
    process.exit(1);
  }
}

createAdmin(); 