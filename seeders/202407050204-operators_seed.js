'use strict';

//const { Sequelize } = require("sequelize");

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert('operators', [
            {
                role: "operator",
                username: "admin",
                password: "admin",
            },
        ], {});
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('operators', null, {});
    }
};