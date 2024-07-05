'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('operators', {
            id_operator: {
                type: Sequelize.STRING,
                defaultValue: process.env.DEFAULT_ID_OPERATOR,
                primaryKey: true,
                allowNull: false
            },
            username: {
                type: Sequelize.STRING,
                defaultValue: process.env.DEFAULT_USERNAME_OPERATOR,
                allowNull: false,
                unique: true
            },
            password: {
                type: Sequelize.STRING,
                defaultValue: process.env.DEFAULT_PASSWORD_OPERATOR,
                allowNull: false
            }
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('operators');
    }
};
