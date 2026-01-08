import { Router } from 'express';
import { register, login } from '../controllers/auth.controller';
import { body } from 'express-validator';

const router = Router();

// 注册路由
router.post(
    '/register',
    [
        body('email').isEmail().withMessage('请输入有效的邮箱地址'),
        body('password')
            .isLength({ min: 6 })
            .withMessage('密码长度至少为6个字符'),
        body('name').notEmpty().withMessage('请输入姓名'),
        body('phone').optional().isMobilePhone('zh-CN').withMessage('请输入有效的手机号码'),
    ],
    register
);

// 登录路由
router.post(
    '/login',
    [
        body('email').isEmail().withMessage('请输入有效的邮箱地址'),
        body('password').notEmpty().withMessage('请输入密码'),
    ],
    login
);

export default router;
