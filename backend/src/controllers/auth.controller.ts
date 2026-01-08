import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';

export const register = async (req: Request, res: Response) => {
    try {
        const { email, password, name, phone } = req.body;

        console.log('Registration attempt:', { email, name, phone });

        // 检查邮箱是否已存在
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            console.log('Email already exists:', email);
            return res.status(400).json({ error: '该邮箱已被注册' });
        }

        // 创建新用户
        const user = await User.create({
            email,
            password,
            name,
            phone,
            role: 'user' // 默认角色
        });

        console.log('User created successfully:', { id: user.id, email: user.email });

        // 生成 JWT token
        const token = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET || 'your_jwt_secret',
            { expiresIn: '24h' }
        );

        // 返回用户信息（不包含密码）
        const { password: _, ...userResponse } = user.toJSON();

        res.status(201).json({
            user: userResponse,
            token,
        });
    } catch (error: any) {
        console.error('Registration error:', {
            message: error.message,
            stack: error.stack,
            details: error
        });
        
        // 根据错误类型返回不同的错误信息
        if (error.name === 'SequelizeValidationError') {
            res.status(400).json({ 
                error: '输入数据验证失败',
                details: error.errors.map((e: any) => ({
                    field: e.path,
                    message: e.message
                }))
            });
        } else if (error.name === 'SequelizeUniqueConstraintError') {
            res.status(400).json({ error: '该邮箱已被注册' });
        } else {
            res.status(500).json({ 
                error: '注册失败，请稍后重试',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // 查找用户
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: '邮箱或密码错误' });
        }

        // 验证密码
        const isValidPassword = await user.validatePassword(password);
        if (!isValidPassword) {
            return res.status(401).json({ error: '邮箱或密码错误' });
        }

        // 生成 JWT token
        const token = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET || 'your_jwt_secret',
            { expiresIn: '24h' }
        );

        // 返回用户信息（不包含密码）
        const { password: _, ...userResponse } = user.toJSON();

        res.json({
            user: userResponse,
            token,
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: '登录失败，请稍后重试' });
    }
};
