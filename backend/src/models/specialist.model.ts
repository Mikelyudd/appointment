import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface SpecialistAttributes {
    id: string;
    shopId: string;
    name: string;
    code: string;
    avatar?: string;
    isAvailable: boolean;
}

interface SpecialistCreationAttributes extends Optional<SpecialistAttributes, 'id'> {}

export class Specialist extends Model<SpecialistAttributes, SpecialistCreationAttributes> {
    public id!: string;
    public shopId!: string;
    public name!: string;
    public code!: string;
    public avatar?: string;
    public isAvailable!: boolean;
}

Specialist.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    shopId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    code: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    avatar: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    isAvailable: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    }
}, {
    sequelize,
    modelName: 'Specialist',
    tableName: 'specialists'
});

export default Specialist;
