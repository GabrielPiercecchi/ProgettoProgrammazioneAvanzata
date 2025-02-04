'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('users', {
            role: {
                type: Sequelize.ENUM('operator', 'gate', 'driver'),
                defaultValue: 'operator',
            },
            username: {
                type: Sequelize.STRING,
                primaryKey: true,
            },
            token: {
                type: Sequelize.INTEGER,
                defaultValue: 10,
            },
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('users');
    }
};
