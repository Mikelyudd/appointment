import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

export interface VerificationAttributes {
    id?: string;
    phone: string;
    code: string;
    status: 'pending' | 'verified' | 'expired';
    createdAt?: Date;
    verifiedAt?: Date;
}

export class Verification extends Model<VerificationAttributes> implements VerificationAttributes {
    public id!: string;
    public phone!: string;
    public code!: string;
    public status!: 'pending' | 'verified' | 'expired';
    public readonly createdAt!: Date;
    public verifiedAt!: Date;
}

Verification.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        code: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM('pending', 'verified', 'expired'),
            allowNull: false,
            defaultValue: 'pending',
        },
        verifiedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    },
    {
        sequelize,
        modelName: 'Verification',
        tableName: 'verifications',
        timestamps: true
    }
);

export default Verification; 