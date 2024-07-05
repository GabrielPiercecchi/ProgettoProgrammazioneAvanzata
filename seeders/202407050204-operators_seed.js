'use strict';

//const { Sequelize } = require("sequelize");

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert('operators', [
            {
                id_operator: process.env.DEFAULT_ID_OPERATOR,
                username: process.env.EFAULT_USERNAME_OPERATOR,
                password: process.env.DEFAULT_PASSWORD_OPERATOR,
            },
        ], {});
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('operators', null, {});
    }
};