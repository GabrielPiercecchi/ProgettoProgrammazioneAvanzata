'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('gates', [
      {
        location: 'LAT43.615829LON13.518915', //we should change it in another format
        username: 'gate',
      },
      {
        location: 'LAT44.494887LON11.342616',
        username: 'gate1',
      }
    ]);
  },
  
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('gates', null, {});
  }
};
