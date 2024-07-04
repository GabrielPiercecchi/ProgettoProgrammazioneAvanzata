'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('sections', {
            initialGate: {
                type: Sequelize.STRING,
                allowNull: false,
                primaryKey: true,
                references: {
                    model: 'gates',
                    key: 'location'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            finalGate: {
                type: Sequelize.STRING,
                allowNull: false,
                primaryKey: true,
                references: {
                    model: 'gates',
                    key: 'location'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            distance: {
                type: Sequelize.FLOAT,
                allowNull: false
            }
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('sections');
    }
};
