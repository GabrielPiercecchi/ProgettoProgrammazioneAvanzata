import { DBIsConnected } from "../database/database";
import { DataTypes, Sequelize, Model } from 'sequelize';
import { Gate } from './gates'; // Import the Gate model

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
    id_ticket: { 
        type: DataTypes.STRING, 
        allowNull: false, 
        primaryKey: true },
    weather: { 
        type: DataTypes.ENUM('good weather, bad weather'), 
        allowNull: false }, //we choose to work with only two generic weather conditions
    plate: { 
        type: DataTypes.STRING, 
        allowNull: false },
    ticket_date: { 
        type: DataTypes.DATE, 
        allowNull: false },
    initial_gate: { 
        type: DataTypes.STRING, 
        allowNull: false, 
        references: { 
            model: Gate, 
            key: 'location' 
        } 
    },
    final_gate: { 
        type: DataTypes.STRING, 
        allowNull: false, 
        references: { 
            model: Gate, 
            key: 'location' 
        } 
    },
    medium_speed: { 
        type: DataTypes.FLOAT, 
        allowNull: false },
    delta_limit: { 
        type: DataTypes.FLOAT, 
        allowNull: false },
}, {
        modelName: 'tickets',
        timestamps: false, //TODO: hooks
    });
