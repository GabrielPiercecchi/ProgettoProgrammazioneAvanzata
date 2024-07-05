'use strict';

//const { Sequelize } = require("sequelize");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('gates', [
      {
        location: '40°33′03.2″N 14°14′33.36″E', //we should change it in another format
        username: 'Capri_1',
        password: 'Capri',
      },
      {
        location: '40°33′02.0″N 14°14′34.0″E',
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