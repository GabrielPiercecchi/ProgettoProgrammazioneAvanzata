'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('gates', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            location: {
                type: Sequelize.STRING,
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
        // Adding the unique constraint
        await queryInterface.addConstraint('gates', {
            fields: ['location'],
            type: 'unique',
            name: 'unique_gate_location'
        });

        // Adding the unique constraint on username
        await queryInterface.addConstraint('gates', {
            fields: ['username'],
            type: 'unique',
            name: 'unique_gate_username'
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('gates');
    }
};
