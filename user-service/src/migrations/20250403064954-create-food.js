'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('food', {
      food_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      calories: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      protein: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      carbs: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      fat: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      serving_size: {
        type: Sequelize.STRING,
        allowNull: true
      },
      serving_unit_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'units_of_measurement',
          key: 'unit_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('food');
  }
};
