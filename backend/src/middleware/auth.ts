import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// 扩展 Request 类型以包含用户信息
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role?: string;
      };
    }
  }
}

export const authenticate = (role?: string) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        res.status(401).json({ message: '未提供认证令牌' });
        return;
      }

      const token = authHeader.split(' ')[1];
      if (!token) {
        res.status(401).json({ message: '无效的认证令牌格式' });
        return;
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret') as { id: string; role?: string };
      
      if (role && decoded.role !== role) {
        res.status(403).json({ message: '没有权限访问此资源' });
        return;
      }

      req.user = decoded;
      next();
    } catch (error) {
      console.error('认证错误:', error);
      res.status(401).json({ message: '认证失败' });
    }
  };
}; 