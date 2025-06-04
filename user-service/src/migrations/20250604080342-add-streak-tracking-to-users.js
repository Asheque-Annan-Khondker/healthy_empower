'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'current_streak', {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      allowNull: false,
      comment: 'Current consecutive days of workout completion'
    });

    await queryInterface.addColumn('users', 'longest_streak', {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      allowNull: false,
      comment: 'Longest streak ever achieved by the user'
    });

    await queryInterface.addColumn('users', 'last_workout_date', {
      type: Sequelize.DATEONLY,
      allowNull: true,
      comment: 'Date of the last completed workout for streak calculation'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'current_streak');
    await queryInterface.removeColumn('users', 'longest_streak');
    await queryInterface.removeColumn('users', 'last_workout_date');
  }
};