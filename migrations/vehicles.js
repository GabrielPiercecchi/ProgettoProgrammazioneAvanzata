'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('vehicles', {
            type: {
                type: Sequelize.STRING,
                primaryKey: true,
                allowNull: false
            },
            limit: {
                type: Sequelize.INTEGER,
                allowNull: false
            }
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('vehicles');
    }
};
