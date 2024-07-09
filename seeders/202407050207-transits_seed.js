'use strict';

//const { Transit, Vehicle, Gate } = require('../models'); // Assumendo che i tuoi modelli siano nella cartella models

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert('transits', [
            {
                plate: 'AB123CD',
                transit_date: new Date(),
                speed: 160,
                weather: 'good weather',
                vehicles_types: 'Car', // Sostituisci con il tipo di veicolo corretto
                gate:1, // Capri1
                used: false
            },
            {
                plate: 'XY987ZT',
                transit_date: new Date(),
                speed: 60,
                weather: 'bad weather',
                vehicles_types: 'Truck', // Sostituisci con il tipo di veicolo corretto
                gate: 2, // Capri2
                used: false
            }
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('transits', null, {});
    }
};
