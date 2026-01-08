import { Router } from 'express';
import { ProfileController } from '../controllers/profile.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// 所有路由都需要认证
router.use(authenticate);

// 个人信息路由
router.get('/', ProfileController.getProfile);
router.put('/', ProfileController.updateProfile);

// 地址管理路由
router.get('/addresses', ProfileController.getAddresses);
router.post('/addresses', ProfileController.addAddress);
router.put('/addresses/:addressId/default', ProfileController.setDefaultAddress);

// 支付方式路由
router.get('/payment-methods', ProfileController.getPaymentMethods);
router.post('/payment-methods', ProfileController.addPaymentMethod);
router.put('/payment-methods/:paymentMethodId/default', ProfileController.setDefaultPaymentMethod);

export default router; 