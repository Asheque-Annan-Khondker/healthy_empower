'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Add double_acorn_equipped column (0 for not equipped, 1 for equipped)
    await queryInterface.addColumn('users', 'double_acorn_equipped', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: '0 for not equipped, 1 for equipped'
    });

    // Add costume_selected column for the currently selected costume
    await queryInterface.addColumn('users', 'costume_selected', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'Regular',
      comment: 'Name of the currently equipped costume'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'double_acorn_equipped');
    await queryInterface.removeColumn('users', 'costume_selected');
  }
};