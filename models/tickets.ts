import { DBIsConnected } from "../database/database";
import { DataTypes, Sequelize, Model } from 'sequelize';
import { Gate } from './gates'; // Import the Gate model
import { Op } from 'sequelize'; // Import the Sequelize operator
import {  fn, col, literal } from 'sequelize';
import PDFDocument from 'pdfkit';

import dotenv from 'dotenv';
import { Response } from 'express'; // Ensure this matches the framework you're using

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
        primaryKey: true
    },
    weather: {
        type: DataTypes.ENUM('good weather, bad weather'),
        allowNull: false
    }, //we choose to work with only two generic weather conditions
    plate: {
        type: DataTypes.STRING,
        allowNull: false
    },
    ticket_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
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
        allowNull: false
    },
    delta_limit: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
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

// GET TICKET BY PLATE AND TIME RANGE 
export async function getTicketsByPlatesAndTime(plates: string[], startDate: string, endDate: string, format: string, res: Response): Promise<any> {
    let tickets: any;
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

        tickets = await Ticket.findAll({ where: whereClause });

        if (tickets.length > 0) {
            if (format === 'pdf') {
                const doc = new PDFDocument();
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', 'attachment; filename=tickets.pdf');

                doc.pipe(res);
                tickets.forEach((ticket: { id_ticket: any; weather: any; plate: any; ticket_date: any; initial_gate: any; final_gate: any; medium_speed: any; delta_limit: any; }) => {
                    doc
                        .fontSize(12)
                        .text(`ID Ticket: ${ticket.id_ticket}`)
                        .text(`Weather: ${ticket.weather}`)
                        .text(`Plate: ${ticket.plate}`)
                        .text(`Ticket Date: ${ticket.ticket_date}`)
                        .text(`Initial Gate: ${ticket.initial_gate}`)
                        .text(`Final Gate: ${ticket.final_gate}`)
                        .text(`Medium Speed: ${ticket.medium_speed}`)
                        .text(`Delta Limit: ${ticket.delta_limit}`)
                        .moveDown();
                });
                doc.end();
                return;
            } else {
                return tickets;
            }
        } else {
            throw new Error('Tickets not found');
        }
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

// NEW METHOD TO GET FREQUENT GATE PAIRS
export async function getFrequentGates(): Promise<any> {
    try {
        const gatePairs = await Ticket.findAll({
            attributes: ['initial_gate', 'final_gate', [fn('COUNT', '*'), 'count']],
            group: ['initial_gate', 'final_gate'],
            order: [[literal('count'), 'DESC']]
        });

        // Find the maximum count
        const maxCount = gatePairs[0]?.get('count');

        // Filter to include only pairs with the maximum count
        const frequentGatePairs = gatePairs.filter(pair => pair.get('count') === maxCount);

        return frequentGatePairs;
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error fetching frequent gate pairs from the database:', error.message);
            throw new Error(`Error fetching frequent gate pairs from the database: ${error.message}`);
        } else {
            console.error('Unknown error fetching frequent gate pairs from the database:', error);
            throw new Error('Unknown error fetching frequent gate pairs from the database.');
        }
    }
}