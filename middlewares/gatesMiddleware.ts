import { Request, Response, NextFunction } from 'express';
import { validateNotNullorEmpty } from './vehiclesMiddleware'; // we choose to import it cause its the same
import { User } from '../models/users';
import { ErrorMessagesGateMIddleware } from '../errorMessages/errorMessages';

// Funzione di validazione per la location
export function validateLocation(location: string): boolean {
    const regex = /^LAT-?\d{2}\.\d{6}LON-?\d{2}\.\d{6}$/;
    return regex.test(location);
}

export function validateId(id: number): boolean {
    return !isNaN(id);
}

// Funzione di validazione per l'username
function validateUsername(username: string): boolean {
    const regex = /^[a-zA-Z][a-zA-Z0-9]*$/;
    return regex.test(username) && isNaN(Number(username));
}

// Middleware per la sanitizzazione dei parametri per GET
export function sanitizeGetGateInputs(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;

    // Validazione della location
    if (!validateId(Number(id))) {
        return res.status(400).json({ error: ErrorMessagesGateMIddleware.invalidIdFormat });
    }

    // Se tutte le validazioni passano, passa al middleware successivo o al controller
    next();
}

// Middleware per la sanitizzazione dei parametri per CREATE
export function sanitizeCreateGateInputs(req: Request, res: Response, next: NextFunction) {
    const { location, username } = req.body;

    if (!validateNotNullorEmpty(location) || !validateNotNullorEmpty(username)) {
        return res.status(400).json({ error: ErrorMessagesGateMIddleware.locationNotNull });
    }

    // Validazione della location
    if (!validateLocation(location)) {
        return res.status(400).json({ error: ErrorMessagesGateMIddleware.invalidLocationFormat });
    }

    // Validazione dell'username
    if (!validateUsername(username)) {
        return res.status(400).json({ error: ErrorMessagesGateMIddleware.invalidUsernameFormat });
    }

    // Se tutte le validazioni passano, passa al middleware successivo o al controller
    next();
}

// Middleware per la sanitizzazione dei parametri per UPDATE
export function sanitizeUpdateGateInputs(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const { newUsername } = req.body;

    if (!validateNotNullorEmpty(newUsername)) {
        return res.status(400).json({ error: ErrorMessagesGateMIddleware.newUsernameNotNull });
    }

    // Validazione della location
    if (!validateId(Number(id))) {
        return res.status(400).json({ error: ErrorMessagesGateMIddleware.invalidIdFormat });
    }

    // Validazione del nuovo username
    if (newUsername && !validateUsername(newUsername)) {
        return res.status(400).json({ error: ErrorMessagesGateMIddleware.invalidUsernameFormat });
    }

    // Se tutte le validazioni passano, passa al middleware successivo o al controller
    next();
}

// Middleware per la sanitizzazione dei parametri per DELETE
export function sanitizeDeleteGateInputs(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    console.log(location);
    if (!validateNotNullorEmpty(location)) {
        return res.status(400).json({ error: ErrorMessagesGateMIddleware.locationNotNull });
    }

    // Validazione del id
    if (!validateId(Number(id))) {
        return res.status(400).json({ error: ErrorMessagesGateMIddleware.invalidIdFormat });
    }


    // Se tutte le validazioni passano, passa al middleware successivo o al controller
    next();
}