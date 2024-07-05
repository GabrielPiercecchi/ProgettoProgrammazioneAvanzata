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
                gate: 'LAT43.6158299LON13.518915', // Capri_1
                used: false
            },
            {
                plate: 'XYZ789',
                transit_date: new Date(),
                speed: 60,
                weather: 'bad weather',
                vehicles_types: 'Truck', // Sostituisci con il tipo di veicolo corretto
                gate: 'LAT44.494887LON11.3426163', // Capri_2
                used: false
            }
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('transits', null, {});
    }
};
