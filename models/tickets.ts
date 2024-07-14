import { DBIsConnected } from '../database/database';
import { DataTypes, Sequelize } from 'sequelize';
import { Op } from 'sequelize';
import { fn, literal } from 'sequelize';
import { Response } from 'express';
import PDFDocument from 'pdfkit';
import dotenv from 'dotenv';
import { Gate } from './gates';
import { ErrorMessagesTicketModel } from '../messages/errorMessages';

dotenv.config();

// Establish database connection
const sequelize: Sequelize = DBIsConnected.getInstance();

/**
 * Ticket model definition
 * Defines the 'Ticket' model with its attributes.
 */
export const Ticket = sequelize.define('tickets', {
    id_ticket: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    weather: {
        type: DataTypes.ENUM('good weather', 'bad weather'),
        allowNull: false
    }, // Only two generic weather conditions are chosen
    plate: {
        type: DataTypes.STRING,
        allowNull: false
    },
    ticket_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    initial_gate: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Gate,
            key: 'id'
        }
    },
    final_gate: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Gate,
            key: 'id'
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
    timestamps: false,
});

/**
 * Retrieves all tickets from the database.
 * 
 * @returns {Promise<any>} - A promise that resolves to an array of Ticket instances
 * @throws {Error} - Throws an error if there's an issue fetching tickets
 */
export async function getAllTickets(): Promise<any> {
    try {
        const result = await Ticket.findAll();
        return result;
    } catch (error) {
        if (error instanceof Error) {
            console.error(ErrorMessagesTicketModel.fetchingError, error.message);
            throw new Error(`${ErrorMessagesTicketModel.fetchingError} ${error.message}`);
        } else {
            console.error(ErrorMessagesTicketModel.unknownFetchingError, error);
            throw new Error(`${ErrorMessagesTicketModel.unknownFetchingError} ${error}`);
        }
    }
}

/**
 * Retrieves tickets based on plates and optional time range.
 * 
 * @param {string[]} plates - Array of plate numbers
 * @param {string} startDate - Start date in string format (YYYY-MM-DD)
 * @param {string} endDate - End date in string format (YYYY-MM-DD)
 * @param {string} format - Output format ('pdf' or undefined for JSON)
 * @param {Response} res - Express response object for sending PDF
 * @returns {Promise<any>} - A promise that resolves to an array of Ticket instances or generates a PDF
 * @throws {Error} - Throws an error if there's an issue fetching tickets
 */
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
                tickets.forEach((ticket: any) => {
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
            throw new Error(`${ErrorMessagesTicketModel.notFound}`);
        }
    } catch (error) {
        if (error instanceof Error) {
            console.error(ErrorMessagesTicketModel.fetchingError, error.message);
            throw new Error(`${ErrorMessagesTicketModel.fetchingError} ${error.message}`);
        } else {
            console.error(ErrorMessagesTicketModel.unknownFetchingError, error);
            throw new Error(`${ErrorMessagesTicketModel.unknownFetchingError} ${error}`);
        }
    }
}

/**
 * Retrieves frequent gate pairs based on ticket data within an optional time range.
 * 
 * @param {string} startDate - Start date in string format (YYYY-MM-DD)
 * @param {string} endDate - End date in string format (YYYY-MM-DD)
 * @returns {Promise<any>} - A promise that resolves to an array of objects representing frequent gate pairs
 * @throws {Error} - Throws an error if there's an issue fetching frequent gate pairs
 */
export async function getFrequentSections(startDate?: string, endDate?: string): Promise<any> {
    let whereClause: any = {};
    let ticketDates: any;
    let tickets: any;
    try {
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

        const gatePairs = await Ticket.findAll({
            attributes: ['initial_gate', 'final_gate', [fn('COUNT', '*'), 'count']],
            where: whereClause,
            group: ['initial_gate', 'final_gate'],
            order: [[literal('count'), 'DESC']]
        });

        // Find the maximum count
        const maxCount = gatePairs[0]?.get('count');

        // Filter to include only pairs with the maximum count
        const frequentGatePairs = gatePairs.filter(pair => pair.get('count') === maxCount);

        // Collect ticket dates for each pair
        const result = await Promise.all(frequentGatePairs.map(async (pair: any) => {
            const { initial_gate, final_gate } = pair.get();
            tickets = await Ticket.findAll({
                attributes: ['ticket_date'],
                where: {
                    initial_gate,
                    final_gate,
                    ...whereClause
                }
            });

            ticketDates = tickets.map((ticket: any) => ticket.ticket_date);

            return {
                initial_gate,
                final_gate,
                count: pair.get('count'),
                ticket_dates: ticketDates
            };
        }));

        return result;
    } catch (error) {
        if (error instanceof Error) {
            console.error(ErrorMessagesTicketModel.frequentSectionsFetchingError, error.message);
            throw new Error(`${ErrorMessagesTicketModel.frequentSectionsFetchingError} ${error.message}`);
        } else {
            console.error(ErrorMessagesTicketModel.unknownFrequentSectionsFetchingError, error);
            throw new Error(`${ErrorMessagesTicketModel.unknownFrequentSectionsFetchingError} ${error}`);
        }
    }
}

/**
 * Retrieves gate pairs with the highest and lowest average speeds within an optional time range.
 * 
 * @param {string} startDate - Start date in string format (YYYY-MM-DD)
 * @param {string} endDate - End date in string format (YYYY-MM-DD)
 * @returns {Promise<any>} - A promise that resolves to an object with max and min speed gate pairs
 * @throws {Error} - Throws an error if there's an issue fetching speed data
 */
export async function getMinMaxSpeed(startDate?: string, endDate?: string) {
    try {
        const whereClause: any = {};

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

        // Find all pairs with maximum speed
        const maxSpeedGatePairs = await Ticket.findAll({
            where: {
                ...whereClause,
                medium_speed: {
                    [Op.eq]: Sequelize.literal(`(SELECT MAX(medium_speed) FROM tickets ${whereClause.ticket_date ? `WHERE ticket_date BETWEEN '${startDate}' AND '${endDate}'` : ''})`),
                },
            },
        });

        // Find all pairs with minimum speed
        const minSpeedGatePairs = await Ticket.findAll({
            where: {
                ...whereClause,
                medium_speed: {
                    [Op.eq]: Sequelize.literal(`(SELECT MIN(medium_speed) FROM tickets ${whereClause.ticket_date ? `WHERE ticket_date BETWEEN '${startDate}' AND '${endDate}'` : ''})`),
                },
            },
        });

        return { maxSpeedGatePairs, minSpeedGatePairs };
    } catch (error) {
        if (error instanceof Error) {
            console.error(ErrorMessagesTicketModel.frequentGetMinMaxSpeed, error.message);
            throw new Error(`${ErrorMessagesTicketModel.frequentGetMinMaxSpeed} ${error.message}`);
        } else {
            console.error(ErrorMessagesTicketModel.unknownFrequentGetMinMaxSpeed, error);
            throw new Error(`${ErrorMessagesTicketModel.unknownFrequentGetMinMaxSpeed} ${error}`);
        }
    }
}
