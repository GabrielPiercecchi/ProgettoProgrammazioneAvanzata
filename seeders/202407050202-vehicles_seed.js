'use strict';

//const { queryInterface } = require('sequelize');
//const { Vehicle } = require('../models'); // Assumendo che i tuoi modelli siano nella cartella models

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert('vehicles', [
            {
                type: 'Car',
                limit: 150
            },
            {
                type: 'Truck',
                limit: 90
            },
            {
                type: 'Motorcycle',
                limit: 120
            }
        ], {});
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('vehicles', null, {});
    }
};
