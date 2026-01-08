import { Router } from 'express';
import { SpecialistController } from '../controllers/specialist.controller';

const router = Router();

// 获取店铺的所有专家
router.get('/shop/:shopId', SpecialistController.getAllByShop);

// 获取可用专家
router.get('/available/:shopId', SpecialistController.getAvailable);

// 管理员路由
router.post('/', SpecialistController.create);
router.put('/:id', SpecialistController.update);
router.delete('/:id', SpecialistController.delete);

export default router;
