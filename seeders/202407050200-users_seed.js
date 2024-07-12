'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert('users', [
            {
                role: 'operator',
                username: 'operator',
                token: 10,
            },
            {
                role: 'gate',
                username: 'gate',
                token: 10,
            },
            {
                role: 'gate',
                username: 'gate1',
                token: 10,
            },
            {
                role: 'driver',
                username: 'driver',
                token: 10,
            }
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('users', null, {});
    }
};