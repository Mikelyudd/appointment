'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // 删除旧表（如果存在）
        await queryInterface.dropTable('verifications', { cascade: true });

        // 创建新表
        await queryInterface.createTable('verifications', {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            },
            phone: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            code: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            status: {
                type: Sequelize.ENUM('pending', 'verified', 'expired'),
                allowNull: false,
                defaultValue: 'pending',
            },
            verifiedAt: {
                type: Sequelize.DATE,
                allowNull: true,
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            }
        });

        // 创建序列
        await queryInterface.sequelize.query('CREATE SEQUENCE IF NOT EXISTS verifications_id_seq');
        
        // 设置序列所有权
        await queryInterface.sequelize.query('ALTER SEQUENCE verifications_id_seq OWNED BY verifications.id');
        
        // 设置默认值
        await queryInterface.sequelize.query('ALTER TABLE verifications ALTER COLUMN id SET DEFAULT nextval(\'verifications_id_seq\')');
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('verifications');
        await queryInterface.sequelize.query('DROP SEQUENCE IF EXISTS verifications_id_seq');
    }
}; 