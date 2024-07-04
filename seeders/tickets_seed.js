'use strict';

//const { Sequelize } = require("sequelize");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('tickets', [
      {
        id_ticket: 'Ticket_1',
        weather: 'good weather',
        plate: 'ABC123',
        ticket_date: new Date(),
        initial_gate: '40°33′03.2″N 14°14′33.36″E', // Capri_1
        final_gate: '40°33′02.0″N 14°14′34.0″E',   //Capri_2
        medium_speed: 50.5,
        delta_limit: 5.0
      },
    ], {});
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('tickets', null, {});
  }
};
