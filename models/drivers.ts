import { DBIsConnected } from "../database/database";
import { DataTypes, Sequelize } from 'sequelize';
import { User } from './users';

//Connection to DataBase
const sequelize: Sequelize = DBIsConnected.getInstance();

/**
 * model 'Driver'
 *
 * Define the model 'Driver' to interface with the "vehicles" table
 */
export const Driver = sequelize.define('drivers', {
    username: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    plate: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    role: {
        type: DataTypes.STRING,
        defaultValue: 'driver',
        allowNull: false,
        references: {
            model: User,
            key: 'role'
        }
    }
},
    {
        modelName: 'gates',
        timestamps: false,
    });