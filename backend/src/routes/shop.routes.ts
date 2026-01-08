import { Router } from 'express';
import { ShopController } from '../controllers/shop.controller';

const router = Router();

// 暂时移除认证测试基本功能
router.post('/', ShopController.create);
router.get('/', ShopController.getAll);
router.get('/:id', ShopController.getOne);
router.put('/:id', ShopController.update);
router.delete('/:id', ShopController.delete);

export default router;
