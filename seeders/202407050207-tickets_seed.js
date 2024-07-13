'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('tickets', [
      {
        id_ticket: 'Ticket_1',
        weather: 'good weather',
        plate: 'AB123CD',
        ticket_date: new Date(),
        initial_gate: 1,
        final_gate: 2,
        medium_speed: 50.5,
        delta_limit: 5.0
      },
      {
        id_ticket: 'Ticket_2',
        weather: 'good weather',
        plate: 'XY123XY',
        ticket_date: new Date(),
        initial_gate: 1,
        final_gate: 2,
        medium_speed: 150.5,
        delta_limit: 5.0
      },
      {
        id_ticket: 'Ticket_3',
        weather: 'good weather',
        plate: 'XY123XY',
        ticket_date: new Date(),
        initial_gate: 1,
        final_gate: 2,
        medium_speed: 350.5,
        delta_limit: 5.0
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('tickets', null, {});
  }
};
