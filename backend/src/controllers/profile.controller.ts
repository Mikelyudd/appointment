import { Request, Response } from 'express';
import { User, Address, PaymentMethod } from '../models';

export class ProfileController {
    // 获取用户个人信息
    static async getProfile(req: Request, res: Response) {
        try {
            const user = await User.findByPk(req.user!.id, {
                attributes: { exclude: ['password'] },
                include: [
                    { model: Address },
                    { model: PaymentMethod }
                ]
            });

            if (!user) {
                return res.status(404).json({ error: '用户不存在' });
            }

            res.json(user);
        } catch (error: any) {
            console.error('获取用户信息失败:', error);
            res.status(500).json({ error: '获取用户信息失败' });
        }
    }

    // 更新用户个人信息
    static async updateProfile(req: Request, res: Response) {
        try {
            const { name, email, phone } = req.body;
            const user = await User.findByPk(req.user!.id);

            if (!user) {
                return res.status(404).json({ error: '用户不存在' });
            }

            // 如果要更新邮箱，检查是否已被使用
            if (email && email !== user.email) {
                const existingUser = await User.findOne({ where: { email } });
                if (existingUser) {
                    return res.status(400).json({ error: '该邮箱已被使用' });
                }
            }

            // 更新用户信息
            await user.update({
                name,
                email,
                phone
            });

            // 返回更新后的用户信息（不包含密码）
            const userResponse = user.toJSON();
            delete userResponse.password;

            res.json(userResponse);
        } catch (error: any) {
            console.error('更新用户信息失败:', error);
            res.status(500).json({ error: '更新用户信息失败' });
        }
    }

    // 获取用户地址列表
    static async getAddresses(req: Request, res: Response) {
        try {
            const addresses = await Address.findAll({
                where: { userId: req.user!.id },
                order: [['isDefault', 'DESC']]
            });

            res.json(addresses);
        } catch (error: any) {
            console.error('获取地址列表失败:', error);
            res.status(500).json({ error: '获取地址列表失败' });
        }
    }

    // 添加新地址
    static async addAddress(req: Request, res: Response) {
        try {
            const addressData = {
                ...req.body,
                userId: req.user!.id
            };

            const address = await Address.create(addressData);
            res.status(201).json(address);
        } catch (error: any) {
            console.error('添加地址失败:', error);
            res.status(500).json({ error: '添加地址失败' });
        }
    }

    // 设置默认地址
    static async setDefaultAddress(req: Request, res: Response) {
        try {
            const { addressId } = req.params;
            const address = await Address.findOne({
                where: {
                    id: addressId,
                    userId: req.user!.id
                }
            });

            if (!address) {
                return res.status(404).json({ error: '地址不存在' });
            }

            await address.update({ isDefault: true });
            res.json(address);
        } catch (error: any) {
            console.error('设置默认地址失败:', error);
            res.status(500).json({ error: '设置默认地址失败' });
        }
    }

    // 获取支付方式列表
    static async getPaymentMethods(req: Request, res: Response) {
        try {
            const paymentMethods = await PaymentMethod.findAll({
                where: { userId: req.user!.id },
                order: [['isDefault', 'DESC']]
            });

            res.json(paymentMethods);
        } catch (error: any) {
            console.error('获取支付方式列表失败:', error);
            res.status(500).json({ error: '获取支付方式列表失败' });
        }
    }

    // 添加新支付方式
    static async addPaymentMethod(req: Request, res: Response) {
        try {
            const paymentData = {
                ...req.body,
                userId: req.user!.id
            };

            const paymentMethod = await PaymentMethod.create(paymentData);
            
            // 返回时排除完整卡号
            const response = {
                ...paymentMethod.toJSON(),
                cardNumber: undefined
            };

            res.status(201).json(response);
        } catch (error: any) {
            console.error('添加支付方式失败:', error);
            res.status(500).json({ error: '添加支付方式失败' });
        }
    }

    // 设置默认支付方式
    static async setDefaultPaymentMethod(req: Request, res: Response) {
        try {
            const { paymentMethodId } = req.params;
            const paymentMethod = await PaymentMethod.findOne({
                where: {
                    id: paymentMethodId,
                    userId: req.user!.id
                }
            });

            if (!paymentMethod) {
                return res.status(404).json({ error: '支付方式不存在' });
            }

            await paymentMethod.update({ isDefault: true });
            res.json(paymentMethod);
        } catch (error: any) {
            console.error('设置默认支付方式失败:', error);
            res.status(500).json({ error: '设置默认支付方式失败' });
        }
    }
} 