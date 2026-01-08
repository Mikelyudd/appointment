import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../types';

// 扩展 Express 的 Request 类型，添加 user 属性
declare global {
    namespace Express {
        interface Request {
            user?: User;
        }
    }
}

export const auth = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            throw new Error();
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as User;
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ error: 'Please authenticate' });
    }
};
