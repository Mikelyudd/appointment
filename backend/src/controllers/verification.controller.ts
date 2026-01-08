import { Request, Response } from 'express';
import { Verification } from '../models';
import { Op } from 'sequelize';
import { TwilioService } from '../services/twilio.service';
import { generateVerificationCode, formatPhoneNumber } from '../utils/verification';

export const verificationController = {
  async sendVerificationCode(req: Request, res: Response) {
    try {
      const { phone } = req.body;
      console.log('发送验证码请求:', { phone });

      if (!phone) {
        return res.status(400).json({ error: '手机号码是必需的' });
      }

      // 格式化手机号码
      const formattedPhone = formatPhoneNumber(phone);
      console.log('格式化后的手机号码:', formattedPhone);

      // 生成验证码
      const code = generateVerificationCode(6);
      console.log('生成的验证码:', code);

      // 创建验证记录
      const verification = await Verification.create({
        phone: formattedPhone,
        code,
        status: 'pending'
      });

      console.log('验证记录已创建:', {
        id: verification.id,
        phone: verification.phone,
        code: verification.code
      });

      // 在开发环境中，直接返回验证码
      if (process.env.NODE_ENV !== 'production') {
        console.log('开发环境，返回验证码:', code);
        return res.json({
          code,
          message: '验证码已发送'
        });
      }

      // 发送短信
      await TwilioService.sendSMS(
        formattedPhone,
        `您的验证码是: ${code}。5分钟内有效。`
      );

      res.json({ 
        message: '验证码已发送'
      });
    } catch (error) {
      console.error('发送验证码失败:', error);
      res.status(500).json({ 
        error: '发送验证码失败'
      });
    }
  },

  async verifyCode(req: Request, res: Response) {
    try {
      const { phone, code } = req.body;
      console.log('验证码验证请求:', { phone, code });

      if (!phone || !code) {
        return res.status(400).json({ 
          success: false,
          error: '手机号码和验证码都是必需的'
        });
      }

      // 格式化手机号码
      const formattedPhone = formatPhoneNumber(phone);

      // 查找最近的验证记录
      const verification = await Verification.findOne({
        where: {
          phone: formattedPhone,
          status: 'pending',
          createdAt: {
            [Op.gte]: new Date(Date.now() - 5 * 60 * 1000) // 5分钟内
          }
        },
        order: [['createdAt', 'DESC']]
      });

      if (!verification) {
        console.log('未找到有效的验证记录:', { phone });
        return res.status(400).json({ 
          success: false,
          error: '验证码已过期或不存在'
        });
      }

      if (verification.code !== code) {
        console.log('验证码不匹配:', {
          expected: verification.code,
          received: code
        });
        return res.status(400).json({ 
          success: false,
          error: '验证码错误'
        });
      }

      // 更新验证状态
      await verification.update({
        status: 'verified',
        verifiedAt: new Date()
      });

      console.log('验证成功:', {
        id: verification.id,
        phone: verification.phone
      });

      res.json({ 
        success: true,
        message: '验证成功'
      });
    } catch (error) {
      console.error('验证码验证失败:', error);
      res.status(500).json({ 
        success: false,
        error: '验证失败'
      });
    }
  },

  async getStats(req: Request, res: Response) {
    try {
      const now = new Date();
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      // 获取今日统计
      const todayVerifications = await Verification.findAll({
        where: {
          createdAt: {
            [Op.gte]: startOfToday
          }
        }
      });

      // 获取本月统计
      const monthVerifications = await Verification.findAll({
        where: {
          createdAt: {
            [Op.gte]: startOfMonth
          }
        }
      });

      // 获取总统计
      const allVerifications = await Verification.findAll();

      // 处理统计数据
      const processStats = (verifications: any[]) => {
        const total = verifications.length;
        const success = verifications.filter(v => v.status === 'verified').length;
        return { total, success };
      };

      const today = processStats(todayVerifications);
      const month = processStats(monthVerifications);
      const total = processStats(allVerifications);

      // 计算成功率
      const successRate = total.total > 0 
        ? ((total.success / total.total) * 100).toFixed(1)
        : '0';

      res.json({
        today,
        month,
        total,
        successRate,
      });
    } catch (error) {
      console.error('获取验证统计失败:', error);
      res.status(500).json({ error: '获取验证统计失败' });
    }
  },

  async getVerifications(req: Request, res: Response) {
    try {
      const { page = 1, limit = 10, phone, status } = req.query;
      const offset = (Number(page) - 1) * Number(limit);

      const where: any = {};
      if (phone) where.phone = { [Op.like]: `%${phone}%` };
      if (status) where.status = status;

      const [total, verifications] = await Promise.all([
        Verification.count({ where }),
        Verification.findAll({
          where,
          order: [['createdAt', 'DESC']],
          offset,
          limit: Number(limit),
        }),
      ]);

      const totalPages = Math.ceil(total / Number(limit));

      res.json({
        total,
        verifications,
        currentPage: Number(page),
        totalPages,
      });
    } catch (error) {
      console.error('获取验证记录失败:', error);
      res.status(500).json({ error: '获取验证记录失败' });
    }
  },

  async getConfig(req: Request, res: Response) {
    try {
      // 从环境变量获取配置
      const config = {
        codeLength: process.env.VERIFICATION_CODE_LENGTH || 6,
        expiryMinutes: process.env.VERIFICATION_CODE_EXPIRY_MINUTES || 5,
        retrySeconds: process.env.VERIFICATION_CODE_RETRY_SECONDS || 60,
      };

      res.json(config);
    } catch (error) {
      console.error('获取验证配置失败:', error);
      res.status(500).json({ error: '获取验证配置失败' });
    }
  },

  async updateConfig(req: Request, res: Response) {
    try {
      const { codeLength, expiryMinutes, retrySeconds } = req.body;

      // 这里应该将配置保存到数据库或更新环境变量
      // 目前仅返回接收到的配置
      const config = {
        codeLength,
        expiryMinutes,
        retrySeconds,
      };

      res.json(config);
    } catch (error) {
      console.error('更新验证配置失败:', error);
      res.status(500).json({ error: '更新验证配置失败' });
    }
  },
}; 