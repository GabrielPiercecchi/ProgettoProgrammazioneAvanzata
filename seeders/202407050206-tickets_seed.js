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
        initial_gate: 'LAT43.6158299LON13.518915', // Capri_1
        final_gate: 'LAT44.494887LON11.3426163',   //Capri_2
        medium_speed: 50.5,
        delta_limit: 5.0
      },
    ], {});
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('tickets', null, {});
  }
};
