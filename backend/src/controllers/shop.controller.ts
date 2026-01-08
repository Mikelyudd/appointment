import { Request, Response } from 'express';
import Shop from '../models/shop.model';
import Service from '../models/service.model';
import Specialist from '../models/specialist.model';

export class ShopController {
    // 创建商家
    static async create(req: Request, res: Response): Promise<void> {
        try {
            const shopData = req.body;
            const shop = await Shop.create(shopData);
            res.status(201).json(shop);
        } catch (error) {
            console.error('Shop creation error:', error);
            res.status(500).json({ error: 'Error creating shop' });
        }
    }

    // 获取所有商家
    static async getAll(req: Request, res: Response): Promise<void> {
        try {
            console.log('Fetching all shops...');
            const shops = await Shop.findAll({
                include: [Service]  // 包含服务信息
            });
            console.log('Shops fetched successfully');
            res.json(shops);
        } catch (error) {
            console.error('Error fetching shops:', error);
            res.status(500).json({ error: `Error fetching shops: ${error.message}` });
        }
    }


    // 获取单个商家详情
    static async getOne(req: Request, res: Response): Promise<void> {
        try {
            const shop = await Shop.findByPk(req.params.id, {
                include: [
                    {
                        model: Service,
                        attributes: ['id', 'name', 'category', 'duration', 'price']
                    },
                    {
                        model: Specialist,
                        attributes: ['id', 'name', 'code']
                    }
                ]
            });

            if (!shop) {
                res.status(404).json({ error: 'Shop not found' });
                return;
            }

            res.json(shop);
        } catch (error) {
            res.status(500).json({ error: 'Error fetching shop' });
        }
    }

    // 更新商家信息
    static async update(req: Request, res: Response): Promise<void> {
        try {
            const shop = await Shop.findByPk(req.params.id);

            if (!shop) {
                res.status(404).json({ error: 'Shop not found' });
                return;
            }

            await shop.update(req.body);
            res.json(shop);
        } catch (error) {
            res.status(500).json({ error: 'Error updating shop' });
        }
    }

    // 删除商家
    static async delete(req: Request, res: Response): Promise<void> {
        try {
            const shop = await Shop.findByPk(req.params.id);

            if (!shop) {
                res.status(404).json({ error: 'Shop not found' });
                return;
            }

            await shop.destroy();
            res.status(204).end();
        } catch (error) {
            res.status(500).json({ error: 'Error deleting shop' });
        }
    }
}
