'use strict';

//const { Sequelize } = require("sequelize");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('drivers', [
      {
        username: 'Driver1',
        password: 'Driver1',
        plate: 'AA123BB',
        role: 'driver',
      },
      {
        username: 'Driver2',
        password: 'Driver2',
        plate: 'XY987ZT',
        role: 'driver',
      }
    ]);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('drivers', null, {});
  }
};