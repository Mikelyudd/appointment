import { Request, Response } from 'express';
import { Verification } from '../../models/verification.model';
import VerificationConfig from '../../models/verification-config.model';
import { Op } from 'sequelize';

export const getVerificationStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // 获取今日验证统计
    const todayStats = await Verification.findAndCountAll({
      where: {
        createdAt: {
          [Op.gte]: today
        }
      }
    });

    // 获取本月验证统计
    const monthStats = await Verification.findAndCountAll({
      where: {
        createdAt: {
          [Op.gte]: thisMonth
        }
      }
    });

    // 获取总验证统计
    const totalStats = await Verification.findAndCountAll();

    // 获取验证成功率（已验证的记录）
    const successStats = await Verification.findAndCountAll({
      where: {
        status: 'verified'
      }
    });

    res.json({
      today: {
        total: todayStats.count,
        success: todayStats.rows.filter(v => v.status === 'verified').length
      },
      month: {
        total: monthStats.count,
        success: monthStats.rows.filter(v => v.status === 'verified').length
      },
      total: {
        total: totalStats.count,
        success: successStats.count
      },
      successRate: totalStats.count > 0 ? (successStats.count / totalStats.count * 100).toFixed(2) : 0
    });
  } catch (error) {
    console.error('获取验证统计失败:', error);
    res.status(500).json({ message: '获取验证统计失败' });
  }
};

export const getVerificationConfig = async (req: Request, res: Response): Promise<void> => {
  try {
    const config = await VerificationConfig.findOne();
    if (!config) {
      // 如果没有配置，创建默认配置
      const defaultConfig = await VerificationConfig.create({
        codeLength: 6,
        expiryMinutes: 5,
        retrySeconds: 60
      });
      res.json(defaultConfig);
      return;
    }
    res.json(config);
  } catch (error) {
    console.error('获取验证配置失败:', error);
    res.status(500).json({ message: '获取验证配置失败' });
  }
};

export const updateVerificationConfig = async (req: Request, res: Response): Promise<void> => {
  try {
    const { codeLength, expiryMinutes, retrySeconds } = req.body;

    let config = await VerificationConfig.findOne();
    if (!config) {
      config = await VerificationConfig.create({
        codeLength,
        expiryMinutes,
        retrySeconds
      });
    } else {
      await config.update({
        codeLength,
        expiryMinutes,
        retrySeconds
      });
    }

    res.json(config);
  } catch (error) {
    console.error('更新验证配置失败:', error);
    res.status(500).json({ message: '更新验证配置失败' });
  }
}; 