import { DBIsConnected } from "../database/database";
import { DataTypes, Sequelize } from 'sequelize';
import { User } from './users';

//Connection to DataBase
const sequelize: Sequelize = DBIsConnected.getInstance();

/**
 * model 'Plate'
 *
 * Define the model 'Plate' to interface with the "Plate" table
 */
export const Plate = sequelize.define('plates', {
    plate: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: User,
            key: 'username'
        },
        onUpdate: 'CASCADE', // Ensure username updates are cascaded to Gates table
        onDelete: 'CASCADE' // Ensure username deletions are cascaded to Gates table
    },
},
    {
        modelName: 'plates',
        timestamps: false,
    });