import { Router } from 'express';
import { verificationController } from '../controllers/verification.controller';
import { RequestHandler } from 'express';

const router = Router();

router.post('/send', verificationController.sendVerificationCode as RequestHandler);
router.post('/verify', verificationController.verifyCode as RequestHandler);

export default router; 