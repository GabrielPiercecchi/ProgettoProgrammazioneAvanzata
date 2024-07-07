'use strict';

//const { Sequelize } = require("sequelize");

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert('users', [
            {
                role: 'operator',
            },
            {
                role: 'gate',
            },
            {
                role: 'driver',
            }
        ]);
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('users', null, {});
    }
};