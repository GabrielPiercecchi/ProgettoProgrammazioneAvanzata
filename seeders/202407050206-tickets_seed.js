'use strict';

//const { Sequelize } = require("sequelize");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('tickets', [
      {
        id_ticket: 'Ticket_1',
        weather: 'good weather',
        plate: 'AB123CD',
        ticket_date: new Date(),
        initial_gate: 1, // Capri1
        final_gate: 2,   //Capri2
        medium_speed: 50.5,
        delta_limit: 5.0
      },
    ], {});
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('tickets', null, {});
  }
};
