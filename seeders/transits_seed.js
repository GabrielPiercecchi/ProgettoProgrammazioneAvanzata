'use strict';

//const { Transit, Vehicle, Gate } = require('../models'); // Assumendo che i tuoi modelli siano nella cartella models

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert('transits', [
            {
                plate: 'ABC123',
                transit_date: new Date(),
                speed: 50,
                weather: 'good weather',
                vehicles_types: 'Car', // Sostituisci con il tipo di veicolo corretto
                gate: '40°33′03.2″N 14°14′33.36″E', // Capri_1
                used: false
            },
            {
                plate: 'XYZ789',
                transit_date: new Date(),
                speed: 60,
                weather: 'bad weather',
                vehicles_types: 'Truck', // Sostituisci con il tipo di veicolo corretto
                gate: '40°33′02.0″N 14°14′34.0″E', // Capri_2
                used: false
            }
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('transits', null, {});
    }
};
