'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('transits', {
            plate: {
                type: Sequelize.STRING,
                allowNull: false,
                primaryKey: true
            },
            transit_date: {
                type: Sequelize.DATE,
                allowNull: false,
                primaryKey: true
            },
            speed: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            weather: {
                type: Sequelize.ENUM('good weather', 'bad weather'),
                defaultValue: 'good weather',
                allowNull: false
            },
            vehicles_types: {
                type: Sequelize.STRING,
                allowNull: false,
                references: {
                    model: 'vehicles',
                    key: 'type'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            gate: {
                type: Sequelize.STRING,
                allowNull: false,
                references: {
                    model: 'gates',
                    key: 'location'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            used: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
                allowNull: false
            }
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('transits');
    }
};
