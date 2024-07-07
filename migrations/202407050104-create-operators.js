'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('operators', {
            id_operator: {
                type: Sequelize.ENUM('operator', 'gate', 'driver'),
                defaultValue: 'operator',
                primaryKey: true,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'role'
                },
            },
            username: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true
            },
            password: {
                type: Sequelize.STRING,
                allowNull: false
            }
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('operators');
    }
};
