'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('units_of_measurement', [
      { name: 'Gram', abbreviation: 'g' },
      { name: 'Kilogram', abbreviation: 'kg' },
      { name: 'Milligram', abbreviation: 'mg' },
      { name: 'Milliliter', abbreviation: 'ml' },
      { name: 'Liter', abbreviation: 'l' },
      { name: 'Ounce', abbreviation: 'oz' },
      { name: 'Pound', abbreviation: 'lb' },
      { name: 'Cup', abbreviation: 'cup' },
      { name: 'Tablespoon', abbreviation: 'tbsp' },
      { name: 'Teaspoon', abbreviation: 'tsp' },
      { name: 'Piece', abbreviation: 'pc' },
      { name: 'Serving', abbreviation: 'serving' }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('units_of_measurement', null, {});
  }
};
