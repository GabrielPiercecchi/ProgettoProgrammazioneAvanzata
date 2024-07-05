'use strict';

//const { queryInterface } = require('sequelize');
//const { Vehicle } = require('../models'); // Assumendo che i tuoi modelli siano nella cartella models

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert('vehicles', [
            {
                type: 'Car',
                limit: 5
            },
            {
                type: 'Truck',
                limit: 10
            },
            {
                type: 'Motorcycle',
                limit: 2
            }
            // Aggiungi altri oggetti se necessario
        ], {});
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('vehicles', null, {});
    }
};
