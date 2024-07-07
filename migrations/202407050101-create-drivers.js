'use strict' // Enables strict mode for JavaScript code
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('drivers', {
            username: {
                type: Sequelize.STRING,
                primaryKey: true,
            },
            password: {
                type: Sequelize.STRING,
                allowNull: false
            },
            plate: {
                type: Sequelize.STRING,
                unique: true,
                allowNull: false
            },
            role: {
                type: Sequelize.ENUM('operator', 'gate', 'driver'),
                defaultValue: 'driver',
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'role'
                },
            },
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('drivers');
    }
};