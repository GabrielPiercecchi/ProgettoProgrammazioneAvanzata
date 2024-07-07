import { DBIsConnected } from "../database/database";
import { DataTypes, Sequelize, Model } from 'sequelize';
import { Gate } from './gates'; // Import the Gate model
import { Op } from 'sequelize'; // Import the Sequelize operator

import dotenv from 'dotenv';

dotenv.config();
//Connection to DataBase
const sequelize: Sequelize = DBIsConnected.getInstance();

/**
 * model 'Ticket'
 *
 * Define the model 'Ticket' with its attributes
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

// GET ALL TICKETS
export async function getAllTickets(): Promise<any> {
    try {
        const result = await Ticket.findAll();
        return result;
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error during Tickets fetching in the database:', error.message);
            throw new Error(`Error during Tickets fetching in the database: ${error.message}`);
        } else {
            console.error('Unknown error during Tickets fetching in the database:', error);
            throw new Error('Unknown error during Tickets fetching in the database.');
        }
    }
}

// GET TICKET BY PLATE AND TIME
export async function getTicketsByPlatesAndTime(plates: string[], startDate: string, endDate: string): Promise<any> {
    try {
        const whereClause: any = {
            plate: { [Op.in]: plates }
        };

        if (startDate && endDate) {
            whereClause.ticket_date = {
                [Op.between]: [new Date(startDate), new Date(endDate)]
            };
        } else if (startDate) {
            whereClause.ticket_date = {
                [Op.gte]: new Date(startDate)
            };
        } else if (endDate) {
            whereClause.ticket_date = {
                [Op.lte]: new Date(endDate)
            };
        }

        const result = await Ticket.findAll({ where: whereClause });
        return result;
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error during Tickets fetching in the database:', error.message);
            throw new Error(`Error during Tickets fetching in the database: ${error.message}`);
        } else {
            console.error('Unknown error during Tickets fetching in the database:', error);
            throw new Error('Unknown error during Tickets fetching in the database.');
        }
    }
}