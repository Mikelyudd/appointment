import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

export type TimeOfDay = 'morning' | 'afternoon' | 'evening';

export interface TimeSlotAttributes {
    id: string;
    shopId: string;
    specialistId: string;
    date: string;
    startTime: string;
    endTime: string;
    isAvailable: boolean;
    timeOfDay: TimeOfDay;
}

export interface TimeSlotCreationAttributes extends Omit<TimeSlotAttributes, 'id'> {}

export class TimeSlot extends Model<TimeSlotAttributes, TimeSlotCreationAttributes> {
    public id!: string;
    public shopId!: string;
    public specialistId!: string;
    public date!: string;
    public startTime!: string;
    public endTime!: string;
    public isAvailable!: boolean;
    public timeOfDay!: TimeOfDay;
}

TimeSlot.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    shopId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    specialistId: {
        type: DataTypes.UUID,
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
    },
    isAvailable: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    timeOfDay: {
        type: DataTypes.ENUM('morning', 'afternoon', 'evening'),
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'TimeSlot',
    tableName: 'time_slots'
});

export default TimeSlot;
