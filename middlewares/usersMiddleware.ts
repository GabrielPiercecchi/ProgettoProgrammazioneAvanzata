import { Request, Response, NextFunction } from 'express';
import { validateNotNullorEmpty } from './vehiclesMiddleware'; // Assumo che validateNotNullorEmpty sia definito in vehiclesMiddleware.ts
import { UserMiddlewareErrors } from '../errorMessages/errorMessages'; // Importa i messaggi di errore

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
        return res.status(400).json({ error: UserMiddlewareErrors.invalidUsernameFormat });
    }

    // Se tutte le validazioni passano, passa al middleware successivo o al controller
    next();
}

// Middleware per la sanitizzazione dei parametri per CREATE
export function sanitizeCreateGateUserInputs(req: Request, res: Response, next: NextFunction) {
    const { username } = req.body;

    if (!validateNotNullorEmpty(username)) {
        return res.status(400).json({ error: UserMiddlewareErrors.usernameNotNullOrEmpty });
    }

    // Validazione dell'username
    if (!validateUsername(username)) {
        return res.status(400).json({ error: UserMiddlewareErrors.invalidUsernameFormat });
    }

    // Se tutte le validazioni passano, passa al middleware successivo o al controller
    next();
}

// Middleware per la sanitizzazione dei parametri per DELETE
export function sanitizeDeleteGateUserInputs(req: Request, res: Response, next: NextFunction) {
    const { username } = req.params;

    if (!validateNotNullorEmpty(username)) {
        return res.status(400).json({ error: UserMiddlewareErrors.usernameNotNullOrEmpty });
    }

    // Validazione della location
    if (!validateUsername(username)) {
        return res.status(400).json({ error: UserMiddlewareErrors.invalidUsernameFormat });
    }

    // Se tutte le validazioni passano, passa al middleware successivo o al controller
    next();
}

// Middleware per la sanitizzazione dei parametri per UPDATE
export function sanitizeUpdateGateUserInputs(req: Request, res: Response, next: NextFunction) {
    const { username } = req.params;
    const { newUsername } = req.body;

    if (!validateNotNullorEmpty(username) || !validateNotNullorEmpty(newUsername)) {
        return res.status(400).json({ error: UserMiddlewareErrors.usernameNewUsernameNotNullOrEmpty });
    }

    // Validazione della location
    if (!validateUsername(username) || !validateUsername(newUsername)) {
        return res.status(400).json({ error: UserMiddlewareErrors.invalidUsernameFormat });
    }

    // Se tutte le validazioni passano, passa al middleware successivo o al controller
    next();
}
