import { Transit } from '../models/transits'; // Supponiamo che Transit sia il modello per la tabella transits
import { Section } from '../models/sections'; // Supponiamo che Section sia il modello per la tabella sections
import { Vehicle } from '../models/vehicles';
import { Ticket, getMinMaxSpeed, getFrequentGates } from '../models/tickets';
import { Gate } from '../models/gates';
import { v4 as uuidv4 } from 'uuid';
import { Op, Sequelize } from 'sequelize'; // Importa l'operatore Sequelize

// Funzione per controllare e gestire i ticket
export async function checkAndHandleTickets(): Promise<void> {
    try {
        console.log("Inizio del processo...");

        const transitCount = await Transit.count();
        console.log(`Numero totale di transiti: ${transitCount}`);

        let transits: any;
        let sections: any;
        let platesMap: any;
        let vehicle: any;
        let vehicleType: any;

        if (transitCount >= 2) {
            console.log("Ci sono almeno 2 transiti.");

            // Step 1: Trova tutti i transiti con used = false e plate diverso da "notFound"
            transits = await Transit.findAll({
                where: {
                    used: false,
                    plate: { [Op.ne]: 'notFound' }
                }
            });
            console.log(`Transiti con used = false trovati: ${transits.length}`);

            // Step 2: Crea una mappa delle targhe per raggruppare i transiti per targa
            platesMap = new Map<string, any[]>();
            for (const transit of transits) {
                if (platesMap.has(transit.plate)) {
                    platesMap.get(transit.plate).push(transit);
                } else {
                    platesMap.set(transit.plate, [transit]);
                }
            }
            console.log("Mappa delle targhe creata:", platesMap);

            // Step 3: Recupera tutte le sezioni
            sections = await Section.findAll();
            console.log(`Sezioni trovate: ${sections.length}`);

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
                                console.log(`Velocità media per la targa ${plate} tra i gate ${transit1.gate} e ${transit2.gate}: ${averageSpeedRounded} km/h`);

                                // Recupera il limite di velocità per il tipo di veicolo
                                vehicleType = await transit1.vehicles_types;
                                vehicle = await Vehicle.findOne({ where: { type: vehicleType } });
                                if (vehicle) {
                                    const speedLimit = vehicle.limit;

                                    if (averageSpeedRounded > speedLimit) {
                                        console.log(`Velocità media (${averageSpeedRounded} km/h) supera il limite (${speedLimit} km/h) per la targa ${plate}`);

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

                                        console.log(`Creato nuovo ticket:`, newTicket);

                                        // Aggiornare il campo `used` dei transiti coinvolti
                                        await transit1.update({ used: true });
                                        await transit2.update({ used: true });

                                        console.log(`Aggiornati i transiti: ${transit1.id} e ${transit2.id} a used = true`);
                                    }
                                }
                            }
                        }
                    }
                }

                if (matchingTransits.length > 0) {
                    console.log(`Transiti corrispondenti per la targa ${plate}:`, matchingTransits);
                }
            }
        } else {
            console.log("Non ci sono abbastanza transiti (almeno 2) per eseguire l'operazione.");
        }
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error during Tickets fetching in the database:', error.message);
            throw new Error(`Error during Tickets fetching in the database: ${error.message}`);
        } else {
            console.error('Unknown error during Tickets fetching in the database:', error);
            throw new Error('Unknown error during Tickets updating in the database.');
        }
    }
}

// Funzione per gestire le stats dei ticket
export const handleGatePairsMethod = async (method: String) => {

    try {
        let data;

        if(method === null || method === undefined) {
            throw new Error('Method not specified.');
        }

        if (method && method === 'getFrequentGates') {
            data = await getFrequentGates();
        } else if (method && method === 'getMinMaxSpeed') {
            const { maxSpeedGatePairs, minSpeedGatePairs } = await getMinMaxSpeed();
            data = { maxSpeedGatePairs, minSpeedGatePairs };
        } else {
            throw new Error('Invalid method specified: must be either "getFrequentGates" or "getMinMaxSpeed".');
        }
        return data;
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error during Tickets Stats fetching in the database:', error.message);
            throw new Error(`Error during Tickets Stats fetching in the database: ${error.message}`);
        } else {
            console.error('Unknown error during Tickets Stats fetching in the database:', error);
            throw new Error('Unknown error during Tickets Stats updating in the database.');
        }
    }
}

