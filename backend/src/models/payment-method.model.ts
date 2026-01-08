import { Model, DataTypes } from 'sequelize';
import { Op } from 'sequelize';
import { sequelize } from '../config/database';
import User from './user.model';

export interface PaymentMethodAttributes {
    id: string;
    userId: string;
    type: 'credit' | 'debit';
    cardNumber: string;         // 加密存储
    cardholderName: string;
    expiryMonth: string;
    expiryYear: string;
    brand: string;              // visa, mastercard, etc.
    last4: string;              // 最后4位数字
    isDefault: boolean;
    billingAddressId?: string;  // 关联的账单地址ID
}

export interface PaymentMethodCreationAttributes extends Omit<PaymentMethodAttributes, 'id'> {}

export class PaymentMethod extends Model<PaymentMethodAttributes, PaymentMethodCreationAttributes> {
    public id!: string;
    public userId!: string;
    public type!: 'credit' | 'debit';
    public cardNumber!: string;
    public cardholderName!: string;
    public expiryMonth!: string;
    public expiryYear!: string;
    public brand!: string;
    public last4!: string;
    public isDefault!: boolean;
    public billingAddressId?: string;

    // 获取掩码卡号
    public get maskedCardNumber(): string {
        return `**** **** **** ${this.last4}`;
    }

    // 获取过期日期
    public get expiryDate(): string {
        return `${this.expiryMonth}/${this.expiryYear}`;
    }
}

PaymentMethod.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    type: {
        type: DataTypes.ENUM('credit', 'debit'),
        allowNull: false
    },
    cardNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        // 注意：实际实现时需要加密存储
    },
    cardholderName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    expiryMonth: {
        type: DataTypes.STRING(2),
        allowNull: false,
        validate: {
            is: /^(0[1-9]|1[0-2])$/
        }
    },
    expiryYear: {
        type: DataTypes.STRING(4),
        allowNull: false,
        validate: {
            is: /^\d{4}$/
        }
    },
    brand: {
        type: DataTypes.STRING,
        allowNull: false
    },
    last4: {
        type: DataTypes.STRING(4),
        allowNull: false,
        validate: {
            is: /^\d{4}$/
        }
    },
    isDefault: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    billingAddressId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'addresses',
            key: 'id'
        }
    }
}, {
    sequelize,
    modelName: 'PaymentMethod',
    tableName: 'payment_methods',
    hooks: {
        beforeCreate: async (paymentMethod: PaymentMethod) => {
            if (paymentMethod.isDefault) {
                // 如果新支付方式设为默认，将用户的其他支付方式设为非默认
                await PaymentMethod.update(
                    { isDefault: false },
                    { 
                        where: { 
                            userId: paymentMethod.userId,
                            isDefault: true 
                        }
                    }
                );
            }
        },
        beforeUpdate: async (paymentMethod: PaymentMethod) => {
            if (paymentMethod.changed('isDefault') && paymentMethod.isDefault) {
                // 如果支付方式被设为默认，将用户的其他支付方式设为非默认
                await PaymentMethod.update(
                    { isDefault: false },
                    { 
                        where: { 
                            userId: paymentMethod.userId,
                            id: { [Op.ne]: paymentMethod.id },
                            isDefault: true 
                        }
                    }
                );
            }
        }
    }
});

// 设置关联关系
PaymentMethod.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(PaymentMethod, { foreignKey: 'userId' });

export default PaymentMethod; 