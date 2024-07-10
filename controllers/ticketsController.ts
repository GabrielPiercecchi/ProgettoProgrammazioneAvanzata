import { Transit } from '../models/transits'; // Supponiamo che Transit sia il modello per la tabella transits
import { Section } from '../models/sections'; // Supponiamo che Section sia il modello per la tabella sections
import { Vehicle } from '../models/vehicles';
import { Ticket, getMinMaxSpeed, getFrequentGates, getAllTickets, getTicketsByPlatesAndTime } from '../models/tickets';
import { v4 as uuidv4 } from 'uuid';
import { Op } from 'sequelize'; // Importa l'operatore Sequelize
import { Plate } from '../models/plates';
import { ErrorMessagesTicketController } from '../errorMessages/errorMessages';

// Funzione per controllare e gestire i ticket
export async function checkAndHandleTickets(): Promise<void> {
    try {
        const transitCount = await Transit.count();

        let transits: any;
        let sections: any;
        let platesMap: any;
        let vehicle: any;
        let vehicleType: any;

        if (transitCount >= 2) {

            // Step 1: Trova tutti i transiti con used = false e plate diverso da "notFound"
            transits = await Transit.findAll({
                where: {
                    used: false,
                    plate: { [Op.ne]: 'notFound' }
                }
            });

            // Step 2: Crea una mappa delle targhe per raggruppare i transiti per targa
            platesMap = new Map<string, any[]>();
            for (const transit of transits) {
                if (platesMap.has(transit.plate)) {
                    platesMap.get(transit.plate).push(transit);
                } else {
                    platesMap.set(transit.plate, [transit]);
                }
            }

            // Step 3: Recupera tutte le sezioni
            sections = await Section.findAll();

            // Step 4: Trova transiti che corrispondono a initialGate e finalGate nelle sezioni
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

                                // Calcolo della velocità media
                                const timeDifference = Math.abs(new Date(transit2.transit_date).getTime() - new Date(transit1.transit_date).getTime());
                                const timeDifferenceHours = timeDifference / (1000 * 60 * 60); // Converti la differenza in ore
                                const averageSpeed = section.distance / timeDifferenceHours;
                                const averageSpeedRounded = parseFloat(averageSpeed.toFixed(2));

                                // Recupera il limite di velocità per il tipo di veicolo
                                vehicleType = await transit1.vehicles_types;
                                vehicle = await Vehicle.findOne({ where: { type: vehicleType } });
                                if (vehicle) {
                                    const speedLimit = vehicle.limit;

                                    if (averageSpeedRounded > speedLimit) {
                                        // Calcolo del delta limit
                                        const deltaLimit = parseFloat((averageSpeedRounded - speedLimit).toFixed(2));

                                        // Creazione del nuovo ticket
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

                                        // Aggiornare il campo `used` dei transiti coinvolti
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

// Funzione per gestire le stats dei ticket
export const handleGatePairsMethod = async (method: string, startDate?: string, endDate?: string) => {
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

export async function returnAllTickets(req: any, res: any) {
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

export async function returnGetTickets(req: any, res: any, plates: string, startDate: string, endDate: string, format: string) {
    // Converte plates in un array
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

            // Assicurati che 'plate' sia il campo corretto nel tuo modello Plate
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
export async function returnStats(req: any, res: any, method: string, startDate: string, endDate: string) {
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