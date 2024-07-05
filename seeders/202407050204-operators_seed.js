'use strict';

//const { Sequelize } = require("sequelize");

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert('operators', [
            {
                id_operator: '1', //we should change it with a numeric token
                username: 'Operator_1',
                password: 'Operator',
            },
        ], {});
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('operators', null, {});
    }
};