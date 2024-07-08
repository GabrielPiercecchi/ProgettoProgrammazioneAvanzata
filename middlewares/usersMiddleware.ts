import { Request, Response, NextFunction } from 'express';
import { validateNotNullorEmpty } from './vehiclesMiddleware';
import { User } from '../models/users';

// Funzione di validazione per l'username
function validateUsername(username: string): boolean {
    const regex = /^[a-zA-Z][a-zA-Z0-9]*$/;
    return regex.test(username) && isNaN(Number(username));
}

// Middleware per la sanitizzazione dei parametri per GET
export function sanitizeGetGateUserInputs(req: Request, res: Response, next: NextFunction) {
    const { username } = req.params;

    // Validazione della location
    if (!validateUsername(username)) {
        return res.status(400).json({ error: 'Invalid username format. Expected format: String' });
    }

    // Se tutte le validazioni passano, passa al middleware successivo o al controller
    next();
}

// Middleware per la sanitizzazione dei parametri per CREATE
export function sanitizeCreateGateUserInputs(req: Request, res: Response, next: NextFunction) {
    const { username } = req.body;

    if (!validateNotNullorEmpty(username)) {
        return res.status(400).json({ error: 'Username cannot be null or undefined.' });
    }

    // Validazione dell'username
    if (!validateUsername(username)) {
        return res.status(400).json({ error: 'Invalid username format. Username must start with a letter and without special characters.' });
    }

    // Se tutte le validazioni passano, passa al middleware successivo o al controller
    next();
}

// Middleware per la sanitizzazione dei parametri per DELETE
export function sanitizeDeleteGateUserInputs(req: Request, res: Response, next: NextFunction) {
    const { username } = req.params;

    if (!validateNotNullorEmpty(username)) {
        return res.status(400).json({ error: 'Username cannot be null or undefined.' });
    }

    // Validazione della location
    if (!validateUsername(username)) {
        return res.status(400).json({ error: 'Invalid Username format. Expected format: String' });
    }

    // Se tutte le validazioni passano, passa al middleware successivo o al controller
    next();
}

// Middleware per la sanitizzazione dei parametri per UPDATE
export function sanitizeUpdateGateUserInputs(req: Request, res: Response, next: NextFunction) {
    const { username } = req.params;
    const { newUsername } = req.body;

    if (!validateNotNullorEmpty(username) || !validateNotNullorEmpty(newUsername)) {
        return res.status(400).json({ error: 'Username and newUsername cannot be null or undefined.' });
    }

    // Validazione della location
    if (!validateUsername(username) || !validateUsername(newUsername)) {
        return res.status(400).json({ error: 'Invalid Username format. Expected format: String' });
    }

    // Se tutte le validazioni passano, passa al middleware successivo o al controller
    next();
}
