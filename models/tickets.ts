import { DBIsConnected } from "../database/database";
import { DataTypes, Sequelize, Model } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();
//Connection to DataBase
const sequelize: Sequelize = DBIsConnected.getInstance();

/**
 * model 'Operator'
 *
 * Define the model 'Operator'
 */
export const Ticket = sequelize.define('tickets', {
    id_ticket: { type: DataTypes.STRING, allowNull: false, primaryKey: true },
    weather: { type: DataTypes.BOOLEAN, defaultValue: true }, // true means good conditions
    plate: { type: DataTypes.STRING, allowNull: false },
    ticket_date: { type: DataTypes.DATE, allowNull: false },
    initial_gate: { type: DataTypes.STRING, allowNull: false },
    final_gate: { type: DataTypes.STRING, allowNull: false },
    medium_speed: { type: DataTypes.FLOAT, allowNull: false },
    delta_limit: { type: DataTypes.FLOAT, allowNull: false },
},
    {
        modelName: 'tickets',
        timestamps: false,
    });
