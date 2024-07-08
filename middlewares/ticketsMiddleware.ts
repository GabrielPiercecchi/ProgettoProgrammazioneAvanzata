import { Request, Response, NextFunction } from 'express';
import { validateNotNullorEmpty } from './vehiclesMiddleware';

// Funzione di validazione per le targhe
function validatePlate(plate: string): boolean {
    const regex = /^[A-Z]{2}\d{3}[A-Z]{2}$/;
    return regex.test(plate);
}

// Funzione di validazione per la data
function validateDate(date: string): boolean {
    // Regex per validare il formato ISO 8601 (YYYY-MM-DDTHH:MM:SS)
    const regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/;
    return regex.test(date);
}

// Funzione di validazione per la formattazione delle targhe
function validatePlatesFormat(plates: string): boolean {
    const regex = /^([A-Z]{2}\d{3}[A-Z]{2})(, [A-Z]{2}\d{3}[A-Z]{2})*$/;
    return regex.test(plates);
}

// Funzione di validazione per il formato
function validateFormat(format: string): boolean {
    return format === 'json' || format === 'pdf';
}

// Middleware per la sanitizzazione dei parametri per GET
export function sanitizeGetTicketsInputs(req: Request, res: Response, next: NextFunction) {
    const { plates, startDate, endDate, format } = req.body;

    // Validazione della formattazione delle targhe
    if (plates && !validatePlatesFormat(plates)) {
        return res.status(400).json({ error: 'Invalid plates format: expected AA123AA. Plates must be separated by a comma and a single space if there are multiple plates.' });
    }

    // Validazione delle targhe
    if (plates) {
        const platesArray = plates.split(', ');
        for (const plate of platesArray) {
            if (!validatePlate(plate.trim())) {
                return res.status(400).json({ error: `Invalid plate format: ${plate.trim()}. Expected format: 2 letters, 3 numbers, 2 letters.` });
            }
        }
    } else {
        return res.status(400).json({ error: 'Plates cannot be null or undefined.' });
    }

    // Validazione della data di inizio
    if (startDate && !validateDate(startDate)) {
        return res.status(400).json({ error: `Invalid start date format: ${startDate}. Expected format: YYYY-MM-DDTHH:MM:SS.` });
    }

    // Validazione della data di fine
    if (endDate && !validateDate(endDate)) {
        return res.status(400).json({ error: `Invalid end date format: ${endDate}. Expected format: YYYY-MM-DDTHH:MM:SS.` });
    }

    // Validazione del formato
    if (!format || !validateFormat(format)) {
        return res.status(400).json({ error: 'Invalid format. Format must be either "json" or "pdf".' });
    }

    // Se tutte le validazioni passano, passa al middleware successivo o al controller
    next();
}

// Middleware per la sanitizzazione dei parametri per POST STATISTICS
export function sanitizePostStatisticsInputs(req: Request, res: Response, next: NextFunction) {
    const { method } = req.params;

    // Validazione del metodo
    if (!validateNotNullorEmpty(method) || (method !== 'getFrequentGates' && method !== 'getMinMaxSpeed')) {
        return res.status(400).json({ error: 'Invalid method. Method must be either "getFrequentGates" or "getMinMaxSpeed".' });
    }

    // Se tutte le validazioni passano, passa al middleware successivo o al controller
    next();
}