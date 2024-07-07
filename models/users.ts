import { DBIsConnected } from "../database/database";
import { DataTypes, Sequelize } from 'sequelize';

//Connection to DataBase
const sequelize: Sequelize = DBIsConnected.getInstance();

/**
 * model 'User'
 *
 * Define the model 'User' to interface with the "vehicles" table
 */
export const User = sequelize.define('users', {
    role: {
        type: DataTypes.ENUM('operator', 'gate', 'driver'),
        defaultValue: 'operator',
        primaryKey: true,
    },
},
    {
        modelName: 'users',
        timestamps: false,
    });