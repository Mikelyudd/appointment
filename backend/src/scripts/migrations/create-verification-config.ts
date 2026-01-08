import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/database';

export async function up() {
  await sequelize.getQueryInterface().createTable('verification_configs', {
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
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });
}

export async function down() {
  await sequelize.getQueryInterface().dropTable('verification_configs');
} 