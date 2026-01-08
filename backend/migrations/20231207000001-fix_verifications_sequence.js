'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // 删除现有序列（如果存在）
        await queryInterface.sequelize.query('DROP SEQUENCE IF EXISTS verifications_id_seq CASCADE;');
        
        // 创建新序列
        await queryInterface.sequelize.query('CREATE SEQUENCE verifications_id_seq;');
        
        // 修改 id 列使用新序列
        await queryInterface.sequelize.query(`
            ALTER TABLE verifications 
            ALTER COLUMN id SET DEFAULT nextval('verifications_id_seq'),
            ALTER COLUMN id SET NOT NULL;
        `);
        
        // 将序列的所有权给予 id 列
        await queryInterface.sequelize.query(`
            ALTER SEQUENCE verifications_id_seq OWNED BY verifications.id;
        `);
        
        // 更新序列的当前值
        await queryInterface.sequelize.query(`
            SELECT setval('verifications_id_seq', COALESCE((SELECT MAX(id) FROM verifications), 0) + 1, false);
        `);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.sequelize.query('DROP SEQUENCE IF EXISTS verifications_id_seq CASCADE;');
    }
}; 