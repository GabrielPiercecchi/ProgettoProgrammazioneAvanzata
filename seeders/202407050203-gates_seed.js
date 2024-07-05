'use strict';

//const { Sequelize } = require("sequelize");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('gates', [
      {
        location: 'LAT43.6158299LON13.518915', //we should change it in another format
        username: 'Capri_1',
        password: 'Capri',
      },
      {
        location: 'LAT44.494887LON11.3426163',
        username: 'Capri_2',
        password: 'Capri',
      }
    ]);
  },
  // down: async (queryInterface, Sequelize) => {
  //   await queryInterface.bulkDelete('gates', {
  //     location: {
  //       [Sequelize.Op.in]: ['40°33′03.2″N 14°14′33.36″E', '40°33′02.0″N 14°14′34.0″E'] // this should drop both istances
  //     }
  //   });
  // }
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('gates', null, {});
  }
};