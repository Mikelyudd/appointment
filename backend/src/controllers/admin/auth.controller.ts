import { Request, Response } from 'express';
import { User } from '../../models';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export const adminAuthController = {
  async register(req: Request, res: Response) {
    try {
      const { email, password, name } = req.body;

      // 检查是否已存在管理员账号
      const existingAdmin = await User.findOne({
        where: { email, role: 'admin' }
      });

      if (existingAdmin) {
        return res.status(400).json({ error: '该邮箱已被注册' });
      }

      // 创建管理员账号
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const admin = await User.create({
        email,
        password: hashedPassword,
        name,
        role: 'admin'
      });

      // 生成 JWT token
      const token = jwt.sign(
        { id: admin.id, role: 'admin' },
        process.env.JWT_SECRET || 'your_jwt_secret',
        { expiresIn: '24h' }
      );

      // 返回用户信息（不包含密码）
      const { password: _, ...adminData } = admin.toJSON();

      res.status(201).json({
        admin: adminData,
        token
      });
    } catch (error) {
      console.error('管理员注册失败:', error);
      res.status(500).json({ error: '注册失败，请稍后重试' });
    }
  },

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      console.log('管理员登录请求:', { email }); // 不记录密码

      if (!email || !password) {
        console.log('缺少必要的登录信息');
        return res.status(400).json({ error: '请提供邮箱和密码' });
      }

      // 查找管理员账号
      const admin = await User.findOne({
        where: { email, role: 'admin' }
      });

      if (!admin) {
        console.log('未找到管理员账号:', email);
        return res.status(401).json({ error: '邮箱或密码错误' });
      }

      console.log('找到管理员账号:', {
        email,
        adminId: admin.id,
        hasPassword: !!admin.password,
        passwordLength: admin.password?.length
      });

      // 验证密码
      const isValidPassword = await admin.validatePassword(password);
      console.log('密码验证结果:', {
        email,
        isValid: isValidPassword
      });

      if (!isValidPassword) {
        console.log('密码验证失败:', { email });
        return res.status(401).json({ error: '邮箱或密码错误' });
      }

      console.log('密码验证成功');

      // 生成 JWT token
      const token = jwt.sign(
        { id: admin.id, role: 'admin' },
        process.env.JWT_SECRET || 'your_jwt_secret',
        { expiresIn: '24h' }
      );

      // 返回用户信息（不包含密码）
      const { password: _, ...adminData } = admin.toJSON();

      console.log('登录成功:', { email, adminId: admin.id });

      res.json({
        admin: adminData,
        token
      });
    } catch (error) {
      console.error('管理员登录失败:', error);
      res.status(500).json({ error: '登录失败，请稍后重试' });
    }
  }
}; 