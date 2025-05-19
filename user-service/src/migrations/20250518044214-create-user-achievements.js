'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('user_achievements', {
      user_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: 'users',
          key: 'user_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      achievement_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: 'achievements',
          key: 'achievement_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      achieved_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('user_achievements');
  }
};