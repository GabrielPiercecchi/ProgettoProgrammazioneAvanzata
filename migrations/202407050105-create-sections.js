'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('sections', {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            initialGate: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'gates',
                    key: 'id'
                },
            },
            finalGate: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'gates',
                    key: 'id'
                },
            },
            distance: {
                type: Sequelize.FLOAT,
                allowNull: false
            }
        });
        // Adding the unique constraint
        await queryInterface.addConstraint('sections', {
            fields: ['initialGate', 'finalGate'],
            type: 'unique',
            name: 'unique_initial_final_gate'
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('sections');
    }
};
