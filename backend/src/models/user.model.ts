import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';
import bcrypt from 'bcryptjs';

export type UserRole = 'user' | 'admin';

export interface UserAttributes {
    id: string;
    email: string;
    password: string;
    name: string;
    phone?: string;
    role: UserRole;
    readonly createdAt?: Date;
    readonly updatedAt?: Date;
}

export interface UserCreationAttributes extends Omit<UserAttributes, 'id'> {}

export class User extends Model<UserAttributes, UserCreationAttributes> {
    public id!: string;
    public email!: string;
    public password!: string;
    public name!: string;
    public phone?: string;
    public role!: UserRole;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    // 验证密码
    async validatePassword(password: string): Promise<boolean> {
        if (!this.password) return false;
        try {
            const isValid = await bcrypt.compare(password, this.password);
            console.log('密码验证结果:', {
                inputPassword: password,
                hashedPassword: this.password,
                isValid
            });
            return isValid;
        } catch (error) {
            console.error('密码验证错误:', error);
            return false;
        }
    }

    // 设置密码
    async setPassword(password: string): Promise<void> {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(password, salt);
    }
}

User.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true,
        },
        role: {
            type: DataTypes.ENUM('user', 'admin'),
            allowNull: false,
            defaultValue: 'user',
        },
    },
    {
        sequelize,
        modelName: 'User',
        tableName: 'users',
        underscored: true,
        hooks: {
            beforeCreate: async (user: User) => {
                if (user.password) {
                    await user.setPassword(user.password);
                }
            },
            beforeUpdate: async (user: User) => {
                if (user.changed('password') && user.password) {
                    await user.setPassword(user.password);
                }
            },
        },
    }
);

export default User;
