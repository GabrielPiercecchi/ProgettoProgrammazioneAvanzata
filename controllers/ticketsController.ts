import { Transit } from '../models/transits';
import { Section } from '../models/sections';
import { Vehicle } from '../models/vehicles';
import { Ticket, getMinMaxSpeed, getFrequentGates, getAllTickets, getTicketsByPlatesAndTime } from '../models/tickets';
import { v4 as uuidv4 } from 'uuid';
import { Op } from 'sequelize';
import { Plate } from '../models/plates';
import { ErrorMessagesTicketController } from '../messages/errorMessages';

/**
 * Function to check and handle tickets based on transit data and sections.
 * This function is designed to find matching transits between gates,
 * calculate average speeds, compare with vehicle speed limits,
 * and create tickets if necessary.
 * 
 * @returns {Promise<void>} - A promise that resolves when ticket handling is complete
 * @throws {Error} - Throws an error if there's an issue during ticket handling
 */
export async function checkAndHandleTickets(): Promise<void> {
    try {
        const transitCount = await Transit.count();

        let transits: any;
        let sections: any;
        let platesMap: any;
        let vehicle: any;
        let vehicleType: any;

        if (transitCount >= 2) {
            // Step 1: Find all transits with used = false and plate not equal to "notFound"
            transits = await Transit.findAll({
                where: {
                    used: false,
                    plate: { [Op.ne]: 'notFound' }
                }
            });

            // Step 2: Create a map of plates to group transits by plate
            platesMap = new Map<string, any[]>();
            for (const transit of transits) {
                if (platesMap.has(transit.plate)) {
                    platesMap.get(transit.plate).push(transit);
                } else {
                    platesMap.set(transit.plate, [transit]);
                }
            }

            // Step 3: Retrieve all sections
            sections = await Section.findAll();

            // Step 4: Find transits matching initialGate and finalGate in sections
            for (const [plate, transits] of platesMap.entries()) {
                const matchingTransits = [];

                for (let i = 0; i < transits.length; i++) {
                    const transit1 = transits[i];

                    for (let j = i + 1; j < transits.length; j++) {
                        const transit2 = transits[j];

                        for (const section of sections) {
                            if (
                                (transit1.gate === section.initialGate && transit2.gate === section.finalGate) ||
                                (transit1.gate === section.finalGate && transit2.gate === section.initialGate)
                            ) {
                                matchingTransits.push([transit1, transit2]);

                                // Calculate average speed
                                const timeDifference = Math.abs(new Date(transit2.transit_date).getTime() - new Date(transit1.transit_date).getTime());
                                const timeDifferenceHours = timeDifference / (1000 * 60 * 60); // Convert difference to hours
                                const averageSpeed = section.distance / timeDifferenceHours;
                                const averageSpeedRounded = parseFloat(averageSpeed.toFixed(2));

                                // Retrieve speed limit for vehicle type
                                vehicleType = await transit1.vehicles_types;
                                vehicle = await Vehicle.findOne({ where: { type: vehicleType } });
                                if (vehicle) {
                                    let speedLimit = vehicle.limit;

                                    if(transit1.weather === 'bad weather' || transit2.weather === 'bad weather') {
                                        // Se il tempo è cattivo, riduci il limite di velocità del 20%
                                        speedLimit = speedLimit - (speedLimit * 0.2);
                                    }

                                    if (averageSpeedRounded > speedLimit) {
                                        // Calculate delta limit
                                        const deltaLimit = parseFloat((averageSpeedRounded - speedLimit).toFixed(2));

                                        // Create new ticket
                                        const newTicket = await Ticket.create({
                                            id_ticket: uuidv4(),
                                            weather: transit1.weather,
                                            plate: transit1.plate,
                                            ticket_date: new Date(),
                                            initial_gate: transit1.gate,
                                            final_gate: transit2.gate,
                                            medium_speed: averageSpeedRounded,
                                            delta_limit: deltaLimit
                                        });

                                        // Update 'used' field of involved transits
                                        await transit1.update({ used: true });
                                        await transit2.update({ used: true });
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    } catch (error) {
        if (error instanceof Error) {
            console.error(ErrorMessagesTicketController.fetchingError, error.message);
            throw new Error(`${ErrorMessagesTicketController.fetchingError} ${error.message}`);
        } else {
            console.error(ErrorMessagesTicketController.unknownError, error);
            throw new Error(`${ErrorMessagesTicketController.unknownError} ${error}`);
        }
    }
}

/**
 * Function to handle gate pairs statistics.
 * 
 * @param {string} method - Method name ('getFrequentGates' or 'getMinMaxSpeed')
 * @param {string} startDate - Optional start date in string format (YYYY-MM-DD)
 * @param {string} endDate - Optional end date in string format (YYYY-MM-DD)
 * @returns {Promise<any>} - A promise that resolves to the requested statistics data
 * @throws {Error} - Throws an error if there's an issue fetching statistics
 */
export const handleGatePairsMethod = async (method: string, startDate?: string, endDate?: string): Promise<any> => {
    try {
        let data;

        if (method === 'getFrequentGates') {
            data = await getFrequentGates(startDate, endDate);
        } else if (method === 'getMinMaxSpeed') {
            const { maxSpeedGatePairs, minSpeedGatePairs } = await getMinMaxSpeed(startDate, endDate);
            data = { maxSpeedGatePairs, minSpeedGatePairs };
        } else {
            throw new Error(`${ErrorMessagesTicketController.invalidMethod} ${method}`);
        }

        return data;
    } catch (error) {
        if (error instanceof Error) {
            console.error(ErrorMessagesTicketController.fetchingError, error.message);
            throw new Error(`${ErrorMessagesTicketController.fetchingError} ${error.message}`);
        } else {
            console.error(ErrorMessagesTicketController.unknownError, error);
            throw new Error(`${ErrorMessagesTicketController.unknownError} ${error}`);
        }
    }
}

/**
 * Function to return all tickets.
 * 
 * @param {any} req - Express request object
 * @param {any} res - Express response object
 * @returns {Promise<void>} - A promise that resolves when tickets are returned to the client
 */
export async function returnAllTickets(req: any, res: any): Promise<void> {
    try {
        const tickets = await getAllTickets();
        res.status(200).json(tickets);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: ErrorMessagesTicketController.unknownError });
        }
    }
}

/**
 * Function to return tickets based on plates and time range.
 * 
 * @param {any} req - Express request object
 * @param {any} res - Express response object
 * @param {string} plates - Comma-separated string of plates
 * @param {string} startDate - Optional start date in string format (YYYY-MM-DD)
 * @param {string} endDate - Optional end date in string format (YYYY-MM-DD)
 * @param {string} format - Output format ('json' or 'pdf')
 * @returns {Promise<void>} - A promise that resolves when tickets are returned to the client
 */
export async function returnGetTickets(req: any, res: any, plates: string, startDate: string, endDate: string, format: string): Promise<void> {
    const platesArray = plates ? plates.split(', ') : [];
    let driverPlates: any[] = [];
    let allPlatesExist: boolean = false;

    try {
        if (req.body.user.role === 'driver') {
            const resultDriver = await Plate.findAll({
                where: {
                    username: req.body.user.username
                }
            });

            driverPlates = resultDriver.map((driver: any) => driver.plate);

            allPlatesExist = platesArray.every(plate => driverPlates.includes(plate));

            if (!allPlatesExist) {
                return res.status(400).json({ error: ErrorMessagesTicketController.platesNotAssigned });
            }
        }

        const tickets = await getTicketsByPlatesAndTime(platesArray, startDate, endDate, format, res);

        if (format === 'json') {
            if (tickets.length > 0) {
                res.status(200).json(tickets);
            } else {
                res.status(404).json({ error: ErrorMessagesTicketController.notFound });
            }
        }
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: ErrorMessagesTicketController.unknownError });
        }
    }
}

/**
 * Function to return statistics data based on the specified method.
 * 
 * @param {any} req - Express request object
 * @param {any} res - Express response object
 * @param {string} method - Method name ('getFrequentGates' or 'getMinMaxSpeed')
 * @param {string} startDate - Optional start date in string format (YYYY-MM-DD)
 * @param {string} endDate - Optional end date in string format (YYYY-MM-DD)
 * @returns {Promise<void>} - A promise that resolves when statistics data are returned to the client
 */
export async function returnStats(req: any, res: any, method: string, startDate: string, endDate: string): Promise<void> {
    let data: any;
    try {
        data = await handleGatePairsMethod(method, startDate as string, endDate as string);
        res.status(200).json(data);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: ErrorMessagesTicketController.unknownError });
        }
    }
}
