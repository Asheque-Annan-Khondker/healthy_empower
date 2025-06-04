'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('workout_plans', 'reward', {
      type: Sequelize.INTEGER,
      defaultValue: 10,
      allowNull: false,
      comment: 'Currency reward for completing this workout plan'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('workout_plans', 'reward');
  }
};