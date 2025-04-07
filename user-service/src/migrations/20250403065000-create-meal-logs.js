'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('meal_logs', {
      meal_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'user_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      food_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'food',
          key: 'food_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      meal_type: {
        type: Sequelize.STRING,
        allowNull: true
      },
      servings: {
        type: Sequelize.DECIMAL,
        allowNull: false,
        defaultValue: 1.0
      },
      logged_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('meal_logs');
  }
};
