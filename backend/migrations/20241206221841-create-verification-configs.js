'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('verification_configs', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      code_length: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 6,
        validate: {
          min: 4,
          max: 8,
        },
      },
      expiry_minutes: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 5,
        validate: {
          min: 1,
          max: 30,
        },
      },
      retry_seconds: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 60,
        validate: {
          min: 30,
          max: 300,
        },
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      }
    });

    // 插入默认配置
    await queryInterface.bulkInsert('verification_configs', [{
      code_length: 6,
      expiry_minutes: 5,
      retry_seconds: 60,
      created_at: new Date(),
      updated_at: new Date()
    }]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('verification_configs');
  }
};
