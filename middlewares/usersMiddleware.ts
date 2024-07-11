import { Request, Response, NextFunction } from 'express';
import { validateNotNullorEmpty } from './vehiclesMiddleware'; // we choose to import it cause its the same
import { UserMiddlewareErrors } from '../messages/errorMessages';

/**
 * Function to validate the username format.
 * @param username - The username to validate.
 * @returns {boolean} - True if the username is valid, false otherwise.
 */
function validateUsername(username: string): boolean {
    const regex = /^[a-zA-Z][a-zA-Z0-9]*$/;
    return regex.test(username) && isNaN(Number(username));
}

/**
 * Middleware to sanitize parameters for GET requests.
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @param next - The next middleware function in the stack.
 */
export function sanitizeGetGateUserInputs(req: Request, res: Response, next: NextFunction) {
    const { username } = req.params;

    // Validate the username
    if (!validateUsername(username)) {
        return res.status(400).json({ error: UserMiddlewareErrors.invalidUsernameFormat });
    }

    // If all validations pass, proceed to the next middleware or controller
    next();
}

/**
 * Middleware to sanitize parameters for CREATE requests.
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @param next - The next middleware function in the stack.
 */
export function sanitizeCreateGateUserInputs(req: Request, res: Response, next: NextFunction) {
    const { username } = req.body;

    if (!validateNotNullorEmpty(username)) {
        return res.status(400).json({ error: UserMiddlewareErrors.usernameNotNullOrEmpty });
    }

    // Validate the username
    if (!validateUsername(username)) {
        return res.status(400).json({ error: UserMiddlewareErrors.invalidUsernameFormat });
    }

    // If all validations pass, proceed to the next middleware or controller
    next();
}

/**
 * Middleware to sanitize parameters for DELETE requests.
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @param next - The next middleware function in the stack.
 */
export function sanitizeDeleteGateUserInputs(req: Request, res: Response, next: NextFunction) {
    const { username } = req.params;

    if (!validateNotNullorEmpty(username)) {
        return res.status(400).json({ error: UserMiddlewareErrors.usernameNotNullOrEmpty });
    }

    // Validate the username
    if (!validateUsername(username)) {
        return res.status(400).json({ error: UserMiddlewareErrors.invalidUsernameFormat });
    }

    // If all validations pass, proceed to the next middleware or controller
    next();
}

/**
 * Middleware to sanitize parameters for UPDATE requests.
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @param next - The next middleware function in the stack.
 */
export function sanitizeUpdateGateUserInputs(req: Request, res: Response, next: NextFunction) {
    const { username } = req.params;
    const { newUsername } = req.body;

    if (!validateNotNullorEmpty(username) || !validateNotNullorEmpty(newUsername)) {
        return res.status(400).json({ error: UserMiddlewareErrors.usernameNewUsernameNotNullOrEmpty });
    }

    // Validate the username and newUsername
    if (!validateUsername(username) || !validateUsername(newUsername)) {
        return res.status(400).json({ error: UserMiddlewareErrors.invalidUsernameFormat });
    }

    // If all validations pass, proceed to the next middleware or controller
    next();
}
