import { Router } from 'express';
import { getVerificationStats, getVerificationConfig, updateVerificationConfig } from '../../controllers/admin/verification.controller';
import { authenticate } from '../../middleware/auth';

const router = Router();

// 验证统计
router.get('/stats', authenticate('admin'), getVerificationStats);

// 验证配置
router.get('/config', authenticate('admin'), getVerificationConfig);
router.put('/config', authenticate('admin'), updateVerificationConfig);

export default router; 