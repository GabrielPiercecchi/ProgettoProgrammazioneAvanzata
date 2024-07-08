'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('transits', {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            plate: {
                type: Sequelize.STRING,
                allowNull: false,
                //primaryKey: true
            },
            transit_date: {
                type: Sequelize.DATE,
                allowNull: false,
                //primaryKey: true
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
            },
            gate: {
                type: Sequelize.STRING,
                allowNull: false,
                references: {
                    model: 'gates',
                    key: 'location'
                },
            },
            used: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
                allowNull: false
            }
        });
        // Adding the unique constraint
        await queryInterface.addConstraint('transits', {
            fields: ['plate', 'transit_date'],
            type: 'unique',
            name: 'unique_plate_transit_date_transits'
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('transits');
    }
};
