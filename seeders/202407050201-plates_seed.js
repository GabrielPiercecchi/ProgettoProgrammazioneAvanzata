'use strict';

//const { Sequelize } = require("sequelize");

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert('plates', [
            {
                username: 'driver',
                plate: 'AB123CD'
            },
            {
                username: 'driver',
                plate: 'XY123XY'
            },
            {
                username: 'driver',
                plate: 'EF123EF'
            }
        ]);
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('plates', null, {});
    }
};