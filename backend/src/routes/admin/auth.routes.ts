import { Router } from 'express';
import { adminAuthController } from '../../controllers/admin/auth.controller';
import { RequestHandler } from 'express';

const router = Router();

router.post('/register', adminAuthController.register as RequestHandler);
router.post('/login', adminAuthController.login as RequestHandler);

export default router; 