'use strict';

//const { Sequelize } = require("sequelize");

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert('users', [
            {
                role: 'operator',
                username: 'operator',
            },
            {
                role: 'gate',
                username: 'gate',
            },
            {
                role: 'driver',
                username: 'driver',
            }
        ]);
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('users', null, {});
    }
};