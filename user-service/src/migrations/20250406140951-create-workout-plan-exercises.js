'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('workout_plan_exercises', {
      plan_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: 'workout_plans',
          key: 'plan_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      exercise_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: 'exercises',
          key: 'exercise_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      sets: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      reps_targets: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      duration: {
        type: Sequelize.INTEGER,
        allowNull: true
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('workout_plan_exercises');
  }
};