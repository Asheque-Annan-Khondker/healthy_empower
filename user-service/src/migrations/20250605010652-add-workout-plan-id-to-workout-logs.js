'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('workout_logs', 'workout_plan_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'workout_plans',
        key: 'plan_id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('workout_logs', 'workout_plan_id');
  }
};