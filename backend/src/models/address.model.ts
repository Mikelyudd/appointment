import { Model, DataTypes } from 'sequelize';
import { Op } from 'sequelize';
import { sequelize } from '../config/database';
import User from './user.model';

export interface AddressAttributes {
    id: string;
    userId: string;
    name: string;           // 地址名称，如"家"、"公司"
    street: string;         // 街道地址
    unit?: string;          // 单元号/门牌号
    city: string;          // 城市
    state: string;         // 州
    zipCode: string;       // 邮编
    isDefault: boolean;    // 是否默认地址
    instructions?: string; // 送货说明
}

export interface AddressCreationAttributes extends Omit<AddressAttributes, 'id'> {}

export class Address extends Model<AddressAttributes, AddressCreationAttributes> {
    public id!: string;
    public userId!: string;
    public name!: string;
    public street!: string;
    public unit?: string;
    public city!: string;
    public state!: string;
    public zipCode!: string;
    public isDefault!: boolean;
    public instructions?: string;

    // 获取完整地址
    public get fullAddress(): string {
        const parts = [this.street];
        if (this.unit) parts.push(this.unit);
        parts.push(this.city, this.state, this.zipCode);
        return parts.join(', ');
    }
}

Address.init({
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
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    street: {
        type: DataTypes.STRING,
        allowNull: false
    },
    unit: {
        type: DataTypes.STRING,
        allowNull: true
    },
    city: {
        type: DataTypes.STRING,
        allowNull: false
    },
    state: {
        type: DataTypes.STRING,
        allowNull: false
    },
    zipCode: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            is: /^\d{5}(-\d{4})?$/  // 验证美国邮编格式
        }
    },
    isDefault: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    instructions: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    sequelize,
    modelName: 'Address',
    tableName: 'addresses',
    hooks: {
        beforeCreate: async (address: Address) => {
            if (address.isDefault) {
                // 如果新地址设为默认，将用户的其他地址设为非默认
                await Address.update(
                    { isDefault: false },
                    { 
                        where: { 
                            userId: address.userId,
                            isDefault: true 
                        }
                    }
                );
            }
        },
        beforeUpdate: async (address: Address) => {
            if (address.changed('isDefault') && address.isDefault) {
                // 如果地址被设为默认，将用户的其他地址设为非默认
                await Address.update(
                    { isDefault: false },
                    { 
                        where: { 
                            userId: address.userId,
                            id: { [Op.ne]: address.id },
                            isDefault: true 
                        }
                    }
                );
            }
        }
    }
});

// 设置关联关系
Address.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Address, { foreignKey: 'userId' });

export default Address; 