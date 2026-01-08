import { Router } from 'express';
import appointmentRoutes from './appointment.routes';
import shopRoutes from './shop.routes';
import serviceRoutes from './service.routes';
import specialistRoutes from './specialist.routes';
import timeSlotRoutes from './timeslot.routes';
import verificationRoutes from './verification.routes';
import adminRoutes from './admin.routes';

const router = Router();

router.use('/appointments', appointmentRoutes);
router.use('/shops', shopRoutes);
router.use('/services', serviceRoutes);
router.use('/specialists', specialistRoutes);
router.use('/timeslots', timeSlotRoutes);
router.use('/verifications', verificationRoutes);
router.use('/admin', adminRoutes);

export default router; 