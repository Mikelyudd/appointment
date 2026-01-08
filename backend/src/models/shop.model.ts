import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

interface WorkingHours {
    isOpen: boolean;
    start: string;
    end: string;
}

interface WorkingSchedule {
    monday: WorkingHours;
    tuesday: WorkingHours;
    wednesday: WorkingHours;
    thursday: WorkingHours;
    friday: WorkingHours;
    saturday: WorkingHours;
    sunday: WorkingHours;
}

export class Shop extends Model {
    public id!: string;
    public name!: string;
    public address!: string;
    public phone!: string;
    public workingHours!: WorkingSchedule;
}

Shop.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false
    },
    workingHours: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {
            monday: { isOpen: true, start: '09:00', end: '20:00' },
            tuesday: { isOpen: true, start: '09:00', end: '20:00' },
            wednesday: { isOpen: true, start: '09:00', end: '20:00' },
            thursday: { isOpen: true, start: '09:00', end: '20:00' },
            friday: { isOpen: true, start: '09:00', end: '20:00' },
            saturday: { isOpen: true, start: '09:00', end: '20:00' },
            sunday: { isOpen: true, start: '09:00', end: '20:00' }
        }
    }
}, {
    sequelize,
    modelName: 'Shop',
    tableName: 'shops'
});

export default Shop;
