import { Request, Response, NextFunction } from 'express';
<<<<<<< HEAD
import { validateNotNullorEmpty } from './vehiclesMiddleware'; // Importing because it's the same.
import { ErrorMessagesTicketMiddleware } from '../errorMessages/errorMessages';
=======
import { validateNotNullorEmpty } from './vehiclesMiddleware';
import { ErrorMessagesTicketMiddleware } from '../messages/errorMessages';
>>>>>>> gabriel

// Validation function for plates
function validatePlate(plate: string): boolean {
    const regex = /^[A-Z]{2}\d{3}[A-Z]{2}$/; // Regex to validate plate format
    return regex.test(plate);
}

// Validation function for date
function validateDate(date: string): boolean {
    // Regex to validate ISO 8601 format (YYYY-MM-DDTHH:MM:SS)
    const regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/;
    return regex.test(date);
}

// Validation function for plates format
function validatePlatesFormat(plates: string): boolean {
    const regex = /^([A-Z]{2}\d{3}[A-Z]{2})(, [A-Z]{2}\d{3}[A-Z]{2})*$/; // Regex to validate comma-separated plates format
    return regex.test(plates);
}

// Validation function for format
function validateFormat(format: string): boolean {
    return format === 'json' || format === 'pdf'; // Check if format is 'json' or 'pdf'
}

/**
 * Middleware to sanitize GET tickets endpoint inputs.
 * @param {Request} req - Express Request object
 * @param {Response} res - Express Response object
 * @param {NextFunction} next - Express NextFunction callback
 */
export function sanitizeGetTicketsInputs(req: Request, res: Response, next: NextFunction) {
    const { plates, startDate, endDate, format } = req.body;

    // Validate plates format
    if (plates && !validatePlatesFormat(plates)) {
        return res.status(400).json({ error: ErrorMessagesTicketMiddleware.invalidPlatesFormat });
    }

    // Validate plates
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

    // Validate start date
    if (startDate && !validateDate(startDate)) {
        return res.status(400).json({ error: ErrorMessagesTicketMiddleware.invalidStartDateFormat });
    }

    // Validate end date
    if (endDate && !validateDate(endDate)) {
        return res.status(400).json({ error: ErrorMessagesTicketMiddleware.invalidEndDateFormat });
    }

    // Validate format
    if (!format || !validateFormat(format)) {
        return res.status(400).json({ error: ErrorMessagesTicketMiddleware.invalidFormat });
    }

    // If all validations pass, move on to the next middleware or controller
    next();
}

/**
 * Middleware to sanitize POST statistics endpoint inputs.
 * @param {Request} req - Express Request object
 * @param {Response} res - Express Response object
 * @param {NextFunction} next - Express NextFunction callback
 */
export function sanitizePostStatisticsInputs(req: Request, res: Response, next: NextFunction) {
    const { method } = req.params;
    const { startDate, endDate } = req.body;

    // Validate method
    if (!validateNotNullorEmpty(method) || (method !== 'getFrequentGates' && method !== 'getMinMaxSpeed')) {
        return res.status(400).json({ error: ErrorMessagesTicketMiddleware.invalidMethod });
    }

    // Validate start date
    if (!validateNotNullorEmpty(startDate) || !validateDate(startDate)) {
        return res.status(400).json({ error: ErrorMessagesTicketMiddleware.invalidStartDateFormat });
    }

    // Validate end date
    if (!validateNotNullorEmpty(endDate) || !validateDate(endDate)) {
        return res.status(400).json({ error: ErrorMessagesTicketMiddleware.invalidEndDateFormat });
    }

    // If all validations pass, move on to the next middleware or controller
    next();
}
