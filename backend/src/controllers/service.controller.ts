import { Request, Response } from 'express';
import { Service } from '../models';

export const getServices = async (req: Request, res: Response) => {
    try {
        const { shopId } = req.query;
        console.log('Request query:', req.query);
        console.log('Fetching services for shopId:', shopId);

        if (!shopId) {
            console.log('No shopId provided');
            return res.status(400).json({ 
                message: 'shopId is required',
                query: req.query 
            });
        }

        const services = await Service.findAll({
            where: { shopId },
            raw: true
        });

        console.log('Found services:', services);

        if (!services || services.length === 0) {
            console.log('No services found for shopId:', shopId);
            return res.json([]);
        }

        console.log('Returning services:', services);
        res.json(services);
    } catch (error: any) {
        console.error('Error fetching services:', error);
        res.status(500).json({ 
            message: 'Failed to fetch services',
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
            query: req.query
        });
    }
};
