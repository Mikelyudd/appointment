import { Router } from 'express';
import { verificationController } from '../controllers/verification.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { RequestHandler } from 'express';

const router = Router();

// 验证码管理
router.get('/verifications/stats', authMiddleware as RequestHandler, verificationController.getStats as RequestHandler);
router.get('/verifications', authMiddleware as RequestHandler, verificationController.getVerifications as RequestHandler);
router.get('/verifications/config', authMiddleware as RequestHandler, verificationController.getConfig as RequestHandler);
router.put('/verifications/config', authMiddleware as RequestHandler, verificationController.updateConfig as RequestHandler);

export default router; 