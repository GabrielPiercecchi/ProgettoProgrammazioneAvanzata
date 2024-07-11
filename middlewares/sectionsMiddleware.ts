import { Request, Response, NextFunction } from 'express';
import { validateNotNullorEmpty } from './vehiclesMiddleware'; // We choose to import it because it's the same
import { ErrorMessagesSectionMiddleware } from '../messages/errorMessages';

/**
 * Validates if the provided id is an integer.
 * @param id - The id to validate.
 * @returns true if the id is an integer, otherwise false.
 */
export function validateId(id: number): boolean {
    return Number.isInteger(id);
}

/**
 * Middleware to sanitize and validate parameters for GET requests.
 * @param req - Express request object.
 * @param res - Express response object.
 * @param next - Express next middleware function.
 */
export function sanitizeGetSectionInputs(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;

    // Validate id
    if (!validateId(Number(id))) {
        return res.status(400).json({ error: ErrorMessagesSectionMiddleware.invalidIdFormat });
    }

    // If all validations pass, proceed to the next middleware or controller
    next();
}

/**
 * Middleware to sanitize and validate parameters for CREATE requests.
 * @param req - Express request object.
 * @param res - Express response object.
 * @param next - Express next middleware function.
 */
export function sanitizeCreateSectionInputs(req: Request, res: Response, next: NextFunction) {
    const { initialGate, finalGate } = req.body;

    // Validate that gates are not null or empty
    if (!validateNotNullorEmpty(initialGate) || !validateNotNullorEmpty(finalGate)) {
        return res.status(400).json({ error: ErrorMessagesSectionMiddleware.gateNotNull });
    }

    // Validate gate ids
    if (!validateId(initialGate) || !validateId(finalGate)) {
        return res.status(400).json({ error: ErrorMessagesSectionMiddleware.invalidGateFormat });
    }

    // If all validations pass, proceed to the next middleware or controller
    next();
}

/**
 * Middleware to sanitize and validate parameters for UPDATE requests.
 * @param req - Express request object.
 * @param res - Express response object.
 * @param next - Express next middleware function.
 */
export function sanitizeUpdateSectionInputs(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const { newInitialGate, newFinalGate } = req.body;

    // Validate id
    if (!validateId(Number(id))) {
        return res.status(400).json({ error: ErrorMessagesSectionMiddleware.invalidIdFormat });
    }

    // Validate that new gates are not null or empty
    if (!validateNotNullorEmpty(newInitialGate) || !validateNotNullorEmpty(newFinalGate)) {
        return res.status(400).json({ error: ErrorMessagesSectionMiddleware.gateNotNull });
    }

    // Validate new gate ids
    if (!validateId(newFinalGate) || !validateId(newInitialGate)) {
        return res.status(400).json({ error: ErrorMessagesSectionMiddleware.invalidGateFormat });
    }

    // If all validations pass, proceed to the next middleware or controller
    next();
}

/**
 * Middleware to sanitize and validate parameters for DELETE requests.
 * @param req - Express request object.
 * @param res - Express response object.
 * @param next - Express next middleware function.
 */
export function sanitizeDeleteSectionInputs(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;

    // Validate id
    if (!validateId(Number(id))) {
        return res.status(400).json({ error: ErrorMessagesSectionMiddleware.invalidIdFormat });
    }

    // If all validations pass, proceed to the next middleware or controller
    next();
}
