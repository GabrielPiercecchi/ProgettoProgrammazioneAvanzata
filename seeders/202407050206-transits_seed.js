'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert('transits', [
            {
                plate: 'AB123CD',
                transit_date: new Date(),
                speed: 160,
                weather: 'good weather',
                vehicles_types: 'Car',
                gate: 1,
                used: false
            },
            {
                plate: 'XY987ZT',
                transit_date: new Date(),
                speed: 60,
                weather: 'bad weather',
                vehicles_types: 'Truck',
                gate: 2,
                used: false
            }
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('transits', null, {});
    }
};
