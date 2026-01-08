import { Router } from 'express';
import { TimeSlotController } from '../controllers/timeslot.controller';

const router = Router();

router.get('/', TimeSlotController.getAvailable);
router.post('/generate', TimeSlotController.generate);
router.get('/available', TimeSlotController.getAvailable);
router.put('/:id/status', TimeSlotController.updateStatus);

export default router;
