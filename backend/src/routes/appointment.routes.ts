import { Router } from 'express';
import { verifyAndCreateAppointment, getUserAppointments } from '../controllers/appointment.controller';

const router = Router();

router.post('/verify-and-create', verifyAndCreateAppointment);
router.get('/user', getUserAppointments);

export default router;
