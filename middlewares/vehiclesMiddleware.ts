import { Request, Response, NextFunction } from 'express';
import { ErrorMessagesVehicleMiddleware } from '../errorMessages/errorMessages';

// Function to validate the speed limit
/**
 * Validates if the speed limit is an integer within the range 30-150.
 * 
 * @param {number} limit - The speed limit to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export function validateSpeedLimit(limit: number): boolean {
    return Number.isInteger(limit) && limit >= 30 && limit <= 150;
}

// Function to validate the type
/**
 * Validates if the type string adheres to the required format.
 * 
 * @param {string} type - The type string to validate
 * @returns {boolean} - True if valid, false otherwise
 */
function validateType(type: string): boolean {
    const regex = /^[a-zA-Z][a-zA-Z0-9]*$/;
    return regex.test(type) && isNaN(Number(type));
}

// Params can't be null
/**
 * Validates if a value is not null, undefined, or an empty string.
 * 
 * @param {any} value - The value to validate
 * @returns {boolean} - True if the value is not null, undefined, or an empty string
 */
export function validateNotNullorEmpty(value: any): boolean {
    return value !== null && value !== undefined && value !== '';
}

// Middleware to sanitize inputs for GET requests
/**
 * Middleware to sanitize inputs for GET requests.
 * 
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @param {NextFunction} next - The next middleware function
 * @returns {void}
 */
export function sanitizeGetVehicleInputs(req: Request, res: Response, next: NextFunction) {
    const { type } = req.params;

    // Validate the type
    if (!validateType(type)) {
        return res.status(400).json({ error: ErrorMessagesVehicleMiddleware.invalidTypeFormat });
    }

    // If all validations pass, proceed to the next middleware or controller
    next();
}

// Middleware per la sanitizzazione dei parametri per CREATE
export function sanitizeCreateVehicleInputs(req: Request, res: Response, next: NextFunction) {
    const { type, limit } = req.body;

    // Validate that type and limit are not null or empty
    if (!validateNotNullorEmpty(type) || !validateNotNullorEmpty(limit)) {
        return res.status(400).json({ error: ErrorMessagesVehicleMiddleware.typeNotNullOrEmpty});
    }

    // Validate the type
    if (!validateType(type)) {
        return res.status(400).json({ error: ErrorMessagesVehicleMiddleware.invalidTypeFormat });
    }

    // Validate the speed limit
    if (!validateSpeedLimit(limit)) {
        return res.status(400).json({ error: ErrorMessagesVehicleMiddleware.invalidSpeedLimit });
    }

    // If all validations pass, proceed to the next middleware or controller
    next();
}

// Middleware to sanitize inputs for UPDATE requests
/**
 * Middleware to sanitize inputs for UPDATE requests.
 * 
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @param {NextFunction} next - The next middleware function
 * @returns {void}
 */
export function sanitizeUpdateVehicleInputs(req: Request, res: Response, next: NextFunction) {
    const { newLimit } = req.body;

    // Validate that newLimit is not null or empty
    if (!validateNotNullorEmpty(newLimit)) {
        return res.status(400).json({ error: ErrorMessagesVehicleMiddleware.newLimitNotNullOrEmpty });
    }

    // Validate the new speed limit
    if (!validateSpeedLimit(newLimit)) {
        return res.status(400).json({ error: ErrorMessagesVehicleMiddleware.invalidSpeedLimit });
    }

    // If all validations pass, proceed to the next middleware or controller
    next();
}

// Middleware to sanitize inputs for DELETE requests
/**
 * Middleware to sanitize inputs for DELETE requests.
 * 
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @param {NextFunction} next - The next middleware function
 * @returns {void}
 */
export function sanitizeDeleteVehicleInputs(req: Request, res: Response, next: NextFunction) {
    const { type } = req.params;

    // Validate the type
    if (!validateType(type)) {
        return res.status(400).json({ error: ErrorMessagesVehicleMiddleware.invalidTypeFormat });
    }

    // If all validations pass, proceed to the next middleware or controller
    next();
}
