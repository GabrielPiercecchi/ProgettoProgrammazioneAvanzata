'use strict' // Enables strict mode for JavaScript code
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('gates', {
            location: {
                type: Sequelize.STRING,
                primaryKey: true,
                allowNull: false
            },
            username: {
                type: Sequelize.STRING,
                unique: true,
                allowNull: false
            },
            password: {
                type: Sequelize.STRING,
                allowNull: false
            },
            role: {
                type: Sequelize.ENUM('operator', 'gate', 'driver'),
                allowNull: false,
                defaultValue: 'gate',
                references: {
                    model: 'users',
                    key: 'role'
                },
            },
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('gates');
    }
};