import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

export interface AppointmentAttributes {
    id: string;
    shopId: string;
    serviceId: string;
    specialistId: string;
    timeSlotId: string;
    userId?: string | null;
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    notes?: string;
    status: 'pending' | 'confirmed' | 'cancelled';
    date: string;
    startTime: string;
    endTime: string;
}

export interface AppointmentCreationAttributes extends Omit<AppointmentAttributes, 'id'> {}

export class Appointment extends Model<AppointmentAttributes, AppointmentCreationAttributes> {
    public id!: string;
    public shopId!: string;
    public serviceId!: string;
    public specialistId!: string;
    public timeSlotId!: string;
    public userId?: string;
    public customerName!: string;
    public customerPhone!: string;
    public customerEmail?: string;
    public notes?: string;
    public status!: 'pending' | 'confirmed' | 'cancelled';
    public date!: string;
    public startTime!: string;
    public endTime!: string;
}

Appointment.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    shopId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    serviceId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    specialistId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    timeSlotId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: true
    },
    customerName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    customerPhone: {
        type: DataTypes.STRING,
        allowNull: false
    },
    customerEmail: {
        type: DataTypes.STRING,
        allowNull: true
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('pending', 'confirmed', 'cancelled'),
        defaultValue: 'pending',
        allowNull: false
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    startTime: {
        type: DataTypes.STRING,
        allowNull: false
    },
    endTime: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'Appointment',
    tableName: 'appointments'
});

export default Appointment;
