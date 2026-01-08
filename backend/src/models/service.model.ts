import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

export class Service extends Model {
    public id!: string;
    public name!: string;
    public description!: string;
    public duration!: number;
    public price!: number;
    public shopId!: string;
    public category!: string;
}

Service.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    duration: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    shopId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'Body Treatment'
    }
}, {
    sequelize,
    modelName: 'Service'
});

export default Service;
