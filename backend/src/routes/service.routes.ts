import { Router } from 'express';
import { getServices } from '../controllers/service.controller';

const router = Router();

router.get('/', getServices);

router.get('/test', (req, res) => {
    res.json({ message: 'Service routes are working' });
});

export default router;
