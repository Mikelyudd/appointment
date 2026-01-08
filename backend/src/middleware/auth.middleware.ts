import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models';

// 定义自定义用户类型
interface CustomUser {
    id: string;
    email?: string;
    phone?: string;
    role?: string;
}

declare global {
    namespace Express {
        interface Request {
            user?: CustomUser;
        }
    }
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log('开始处理认证中间件');
        console.log('请求头:', {
            authorization: req.headers.authorization,
            guestPhone: req.headers['x-guest-phone']
        });

        // 获取认证头
        const authHeader = req.headers.authorization;
        const guestPhone = req.headers['x-guest-phone'];

        if (authHeader) {
            console.log('处理登录用户认证');
            const token = authHeader.split(' ')[1];
            console.log('解析token');
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
            console.log('解码的token:', { userId: decoded.id });

            const user = await User.findByPk(decoded.id);
            if (!user) {
                console.log('未找到用户');
                return res.status(401).json({ error: 'User not found' });
            }
            console.log('找到用户:', { id: user.id, email: user.email });

            req.user = {
                id: user.id,
                email: user.email || undefined,
                phone: user.phone,
                role: user.role
            };
            console.log('设置请求用户信息:', req.user);
            next();
        } else if (guestPhone) {
            console.log('处理游客用户');
            req.user = {
                id: '',
                email: undefined,
                phone: guestPhone as string
            };
            console.log('设置游客用户信息:', req.user);
            next();
        } else {
            return res.status(401).json({ error: 'Unauthorized' });
        }
    } catch (error) {
        if (error instanceof Error) {
            console.error('认证中间件错误:', error);
            console.error('错误详情:', {
                message: error.message,
                stack: error.stack,
                name: error.name,
                headers: req.headers
            });
            if (error instanceof jwt.JsonWebTokenError) {
                return res.status(401).json({ error: 'Invalid token' });
            }
        }
        return res.status(401).json({ error: 'Authentication failed' });
    }
}; 