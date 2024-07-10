'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('tickets', {
            id_ticket: {
                type: Sequelize.STRING,
                allowNull: false,
                primaryKey: true
            },
            weather: {
                type: Sequelize.ENUM('good weather', 'bad weather'),
                allowNull: false
            },
            plate: {
                type: Sequelize.STRING,
                allowNull: false
            },
            ticket_date: {
                type: Sequelize.DATE,
                allowNull: false
            },
            initial_gate: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'gates',
                    key: 'id'
                },
            },
            final_gate: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'gates',
                    key: 'id'
                },
            },
            medium_speed: {
                type: Sequelize.FLOAT,
                allowNull: false
            },
            delta_limit: {
                type: Sequelize.FLOAT,
                allowNull: false
            }
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('tickets');
    }
};
