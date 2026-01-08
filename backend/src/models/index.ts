import { sequelize } from '../config/database';
import Shop from './shop.model';
import Service from './service.model';
import Specialist from './specialist.model';
import TimeSlot from './timeslot.model';
import Appointment from './appointment.model';
import { Verification } from './verification.model';
import User from './user.model';
import Address from './address.model';
import PaymentMethod from './payment-method.model';
import VerificationConfig from './verification-config.model';

// Define associations
Shop.hasMany(Service, { foreignKey: 'shopId', as: 'services' });
Shop.hasMany(Specialist, { foreignKey: 'shopId', as: 'specialists' });
Shop.hasMany(TimeSlot, { foreignKey: 'shopId', as: 'timeSlots' });
Shop.hasMany(Appointment, { foreignKey: 'shopId', as: 'appointments' });

Service.belongsTo(Shop, { foreignKey: 'shopId', as: 'shop' });
Service.hasMany(Appointment, { foreignKey: 'serviceId', as: 'appointments' });

Specialist.belongsTo(Shop, { foreignKey: 'shopId', as: 'shop' });
Specialist.hasMany(TimeSlot, { foreignKey: 'specialistId', as: 'timeSlots' });
Specialist.hasMany(Appointment, { foreignKey: 'specialistId', as: 'appointments' });

TimeSlot.belongsTo(Shop, { foreignKey: 'shopId', as: 'shop' });
TimeSlot.belongsTo(Specialist, { foreignKey: 'specialistId', as: 'specialist' });
TimeSlot.hasMany(Appointment, { foreignKey: 'timeSlotId', as: 'appointments' });

Appointment.belongsTo(Shop, { foreignKey: 'shopId', as: 'shop' });
Appointment.belongsTo(Service, { foreignKey: 'serviceId', as: 'service' });
Appointment.belongsTo(Specialist, { foreignKey: 'specialistId', as: 'specialist' });
Appointment.belongsTo(TimeSlot, { foreignKey: 'timeSlotId', as: 'timeSlot' });
Appointment.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Appointment, { foreignKey: 'userId', as: 'appointments' });
User.hasMany(Address, { foreignKey: 'userId', as: 'addresses' });
User.hasMany(PaymentMethod, { foreignKey: 'userId', as: 'paymentMethods' });

// 初始化验证配置
(async () => {
    try {
        const config = await VerificationConfig.findOne();
        if (!config) {
            await VerificationConfig.create({
                id: 1,
                codeLength: 6,
                expiryMinutes: 5,
                retrySeconds: 60
            }).catch(console.error);
            console.log('Created default verification config');
        }
    } catch (error) {
        console.error('Failed to initialize verification config:', error);
    }
})();

export {
    sequelize,
    Shop,
    Service,
    Specialist,
    TimeSlot,
    Appointment,
    Verification,
    User,
    Address,
    PaymentMethod,
    VerificationConfig
};
