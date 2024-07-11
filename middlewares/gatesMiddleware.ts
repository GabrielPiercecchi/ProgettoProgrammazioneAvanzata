import { Request, Response, NextFunction } from 'express';
import { validateNotNullorEmpty } from './vehiclesMiddleware'; // we choose to import it cause its the same.
import { ErrorMessagesGateMIddleware } from '../messages/errorMessages';

/**
 * Validates if the provided location string matches the format LAT-xx.xxxxxxLON-xx.xxxxxx.
 * 
 * @param {string} location - The location string to validate
 * @returns {boolean} - True if the location format is valid, false otherwise
 */
export function validateLocation(location: string): boolean {
    const regex = /^LAT-?\d{2}\.\d{6}LON-?\d{2}\.\d{6}$/;
    return regex.test(location);
}

/**
 * Validates if the provided id is a valid number.
 * 
 * @param {number} id - The id to validate
 * @returns {boolean} - True if the id is a valid number, false otherwise
 */
export function validateId(id: number): boolean {
    return !isNaN(id);
}

/**
 * Validates if the provided username string matches the format of starting with a letter 
 * and consisting of alphanumeric characters.
 * 
 * @param {string} username - The username string to validate
 * @returns {boolean} - True if the username format is valid, false otherwise
 */
function validateUsername(username: string): boolean {
    const regex = /^[a-zA-Z][a-zA-Z0-9]*$/;
    return regex.test(username) && isNaN(Number(username));
}

/**
 * Middleware function to sanitize GET request parameters for gate operations.
 * 
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @param {NextFunction} next - The next middleware function
 */
export function sanitizeGetGateInputs(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;

    // Validation of id
    if (!validateId(Number(id))) {
        return res.status(400).json({ error: ErrorMessagesGateMIddleware.invalidIdFormat });
    }

    // If all validations pass, move on to the next middleware or controller
    next();
}

/**
 * Middleware function to sanitize CREATE request parameters for gate operations.
 * 
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @param {NextFunction} next - The next middleware function
 */
export function sanitizeCreateGateInputs(req: Request, res: Response, next: NextFunction) {
    const { location, username } = req.body;

    if (!validateNotNullorEmpty(location) || !validateNotNullorEmpty(username)) {
        return res.status(400).json({ error: ErrorMessagesGateMIddleware.locationNotNull });
    }

    // Validation of location
    if (!validateLocation(location)) {
        return res.status(400).json({ error: ErrorMessagesGateMIddleware.invalidLocationFormat });
    }

    // Validation of username
    if (!validateUsername(username)) {
        return res.status(400).json({ error: ErrorMessagesGateMIddleware.invalidUsernameFormat });
    }

    // If all validations pass, move on to the next middleware or controller
    next();
}

/**
 * Middleware function to sanitize UPDATE request parameters for gate operations.
 * 
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @param {NextFunction} next - The next middleware function
 */
export function sanitizeUpdateGateInputs(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const { newUsername } = req.body;

    if (!validateNotNullorEmpty(newUsername)) {
        return res.status(400).json({ error: ErrorMessagesGateMIddleware.newUsernameNotNull });
    }

    // Validation of id
    if (!validateId(Number(id))) {
        return res.status(400).json({ error: ErrorMessagesGateMIddleware.invalidIdFormat });
    }

    // Validation of new username
    if (newUsername && !validateUsername(newUsername)) {
        return res.status(400).json({ error: ErrorMessagesGateMIddleware.invalidUsernameFormat });
    }

    // If all validations pass, move on to the next middleware or controller
    next();
}

/**
 * Middleware function to sanitize DELETE request parameters for gate operations.
 * 
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @param {NextFunction} next - The next middleware function
 */
export function sanitizeDeleteGateInputs(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;

    // Validation of id
    if (!validateId(Number(id))) {
        return res.status(400).json({ error: ErrorMessagesGateMIddleware.invalidIdFormat });
    }

    // If all validations pass, move on to the next middleware or controller
    next();
}
