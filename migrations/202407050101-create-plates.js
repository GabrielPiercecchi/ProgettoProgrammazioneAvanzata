'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('plates', {
            plate: {
                type: Sequelize.STRING,
                primaryKey: true
            },
            username: {
                type: Sequelize.STRING,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'username'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('plates');
    }
};
