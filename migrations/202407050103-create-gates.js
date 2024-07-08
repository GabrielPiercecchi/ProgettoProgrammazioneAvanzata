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
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'username'
                },
                onUpdate: 'CASCADE',
            },
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('gates');
    }
};