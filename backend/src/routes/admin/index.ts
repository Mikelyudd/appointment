import { Router } from 'express';
import verificationRoutes from './verification.routes';
import authRoutes from './auth.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/verifications', verificationRoutes);

export default router; 