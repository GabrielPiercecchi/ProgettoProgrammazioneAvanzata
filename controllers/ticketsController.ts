import { Transit } from '../models/transits'; // Supponiamo che Transit sia il modello per la tabella transits

// Funzione per controllare il numero di transiti e eseguire un'azione se sono almeno due
async function checkAndHandleTransits(): Promise<void> {
    try {
        const transitCount = await Transit.count(); // Conta il numero di transiti
        let transits: any;
        let platesMap: any;
        if (transitCount >= 2) {
            transits = await Transit.findAll({
                where: {
                    used: false
                }
            });
            platesMap = await new Map<string, any[]>();
            for (const transit of transits) {
                if (platesMap.has(transit.plate)) {
                    // Se la plate è già presente, aggiungi questo transit all'array
                    platesMap.get(transit.plate).push(transit);
                } else {
                    // Altrimenti, crea un nuovo array con questo transit
                    platesMap.set(transit.plate, [transit]);
                }
            }
            // platesMap.forEach((transitsWithSamePlate, plate) => {
            //     if (transitsWithSamePlate.length > 1) {
            //         console.log(`Trovate ${transitsWithSamePlate.length} istanze con la stessa plate (${plate}):`, transitsWithSamePlate);
            //         // Qui puoi gestire le coppie come necessario
            //     }
            // });
        }
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error during Tickets fetching in the database:', error.message);
            throw new Error(`Error during Tickets fetching in the database: ${error.message}`);
        } else {
            console.error('Unknown error during Tickets fetching in the database:', error);
            throw new Error('Unknown error during Gate updating in the database.');
        }
    }
}