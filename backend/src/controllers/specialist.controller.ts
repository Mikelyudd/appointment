import { Request, Response } from 'express';
import { SpecialistService } from '../services/specialist.service';

export class SpecialistController {
    // Get all specialists for a shop
    static async getAllByShop(req: Request, res: Response) {
        try {
            const { shopId } = req.params;
            const specialists = await SpecialistService.getAllByShop(shopId);
            res.json(specialists);
        } catch (error) {
            console.error('Error fetching specialists:', error);
            res.status(500).json({ 
                error: 'Failed to fetch specialists',
                details: error.message 
            });
        }
    }

    // Get available specialists
    static async getAvailable(req: Request, res: Response) {
        try {
            const { shopId } = req.params;
            const { date, startTime } = req.query;

            if (!date || !startTime) {
                return res.status(400).json({ 
                    error: 'Date and start time are required' 
                });
            }

            const specialists = await SpecialistService.getAvailableSpecialists(
                shopId,
                date as string,
                startTime as string
            );
            res.json(specialists);
        } catch (error) {
            console.error('Error fetching available specialists:', error);
            res.status(500).json({ 
                error: 'Failed to fetch available specialists',
                details: error.message 
            });
        }
    }

    // Create a new specialist
    static async create(req: Request, res: Response) {
        try {
            const specialist = await SpecialistService.create(req.body);
            res.status(201).json(specialist);
        } catch (error) {
            console.error('Error creating specialist:', error);
            res.status(500).json({ 
                error: 'Failed to create specialist',
                details: error.message 
            });
        }
    }

    // Update a specialist
    static async update(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const specialist = await SpecialistService.update(id, req.body);
            res.json(specialist);
        } catch (error) {
            if (error.message === 'Specialist not found') {
                res.status(404).json({ error: 'Specialist not found' });
            } else {
                console.error('Error updating specialist:', error);
                res.status(500).json({ 
                    error: 'Failed to update specialist',
                    details: error.message 
                });
            }
        }
    }

    // Delete a specialist
    static async delete(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await SpecialistService.delete(id);
            res.status(204).end();
        } catch (error) {
            if (error.message === 'Specialist not found') {
                res.status(404).json({ error: 'Specialist not found' });
            } else {
                console.error('Error deleting specialist:', error);
                res.status(500).json({ 
                    error: 'Failed to delete specialist',
                    details: error.message 
                });
            }
        }
    }
}
