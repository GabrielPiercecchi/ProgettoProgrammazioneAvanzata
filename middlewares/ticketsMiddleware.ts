import { Request, Response, NextFunction } from 'express';
import { validateNotNullorEmpty } from './vehiclesMiddleware';
import { ErrorMessagesTicketMiddleware } from '../messages/errorMessages';

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
        return res.status(400).json({ error: ErrorMessagesTicketMiddleware.invalidPlatesFormat });
    }

    // Validazione delle targhe
    if (plates) {
        const platesArray = plates.split(', ');
        for (const plate of platesArray) {
            if (!validatePlate(plate.trim())) {
                return res.status(400).json({ error: ErrorMessagesTicketMiddleware.invalidPlateFormat });
            }
        }
    } else {
        return res.status(400).json({ error: ErrorMessagesTicketMiddleware.platesNotNullOrUndefined });
    }

    // Validazione della data di inizio
    if (startDate && !validateDate(startDate)) {
        return res.status(400).json({ error: ErrorMessagesTicketMiddleware.invalidStartDateFormat });
    }

    // Validazione della data di fine
    if (endDate && !validateDate(endDate)) {
        return res.status(400).json({ error: ErrorMessagesTicketMiddleware.invalidEndDateFormat });
    }

    // Validazione del formato
    if (!format || !validateFormat(format)) {
        return res.status(400).json({ error: ErrorMessagesTicketMiddleware.invalidFormat});
    }

    // Se tutte le validazioni passano, passa al middleware successivo o al controller
    next();
}

// Middleware per la sanitizzazione dei parametri per POST STATISTICS
export function sanitizePostStatisticsInputs(req: Request, res: Response, next: NextFunction) {
    const { method } = req.params;
    const { startDate, endDate } = req.body;

    // Validazione del metodo
    if (!validateNotNullorEmpty(method) || (method !== 'getFrequentGates' && method !== 'getMinMaxSpeed')) {
        return res.status(400).json({ error: ErrorMessagesTicketMiddleware.invalidMethod });
    }

    if (!validateNotNullorEmpty(startDate) || !validateDate(startDate)) {
        return res.status(400).json({ error: ErrorMessagesTicketMiddleware.invalidStartDateFormat });
    }

    if (!validateNotNullorEmpty(endDate) || !validateDate(endDate)) {
        return res.status(400).json({ error: ErrorMessagesTicketMiddleware.invalidEndDateFormat });
    }

    // Se tutte le validazioni passano, passa al middleware successivo o al controller
    next();
}