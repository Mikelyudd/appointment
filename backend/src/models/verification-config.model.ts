import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

interface VerificationConfigAttributes {
  id?: number;
  codeLength: number;
  expiryMinutes: number;
  retrySeconds: number;
  createdAt?: Date;
  updatedAt?: Date;
}

class VerificationConfig extends Model<VerificationConfigAttributes> implements VerificationConfigAttributes {
  public id!: number;
  public codeLength!: number;
  public expiryMinutes!: number;
  public retrySeconds!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

VerificationConfig.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    codeLength: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 6,
    },
    expiryMinutes: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 5,
    },
    retrySeconds: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 60,
    },
  },
  {
    sequelize,
    tableName: 'verification_configs',
    timestamps: true,
  }
);

export default VerificationConfig; 