import { Request, Response, NextFunction } from 'express';
<<<<<<< HEAD
import { validateNotNullorEmpty } from './vehiclesMiddleware'; //Importing because it's the same.
=======
import { validateNotNullorEmpty } from './vehiclesMiddleware'; // we choose to import it cause its the same
import { ErrorMessagesSectionMiddleware } from '../messages/errorMessages';
>>>>>>> gabriel

// // Funzione di validazione per la location
// function validateLocation(location: string): boolean {
//     const regex = /^LAT-?\d{2}\.\d{6}LON-?\d{2}\.\d{6}$/;
//     return regex.test(location);
// }

// Funzione di validazione per id
export function validateId(id: number): boolean {
    return Number.isInteger(id);
}

// Middleware per la sanitizzazione dei parametri per GET
export function sanitizeGetSectionInputs(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;

    // Validazione della location
    if (!validateId(Number(id))) {
        return res.status(400).json({ error: ErrorMessagesSectionMiddleware.invalidIdFormat });
    }

    // Se tutte le validazioni passano, passa al middleware successivo o al controller
    next();
}

// Middleware per la sanitizzazione dei parametri per CREATE
export function sanitizeCreateSectionInputs(req: Request, res: Response, next: NextFunction) {
    const { initialGate, finalGate } = req.body;

    if (!validateNotNullorEmpty(initialGate) || !validateNotNullorEmpty(finalGate)) {
        return res.status(400).json({ error: ErrorMessagesSectionMiddleware.gateNotNull });
    }
    // Validazione della location
    if (!validateId(initialGate) || !validateId(finalGate)) {
        return res.status(400).json({ error: ErrorMessagesSectionMiddleware.invalidGateFormat });
    }

    // Se tutte le validazioni passano, passa al middleware successivo o al controller
    next();
}

// Middleware per la sanitizzazione dei parametri per UPDATE
export function sanitizeUpdateSectionInputs(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const { newInitialGate, newFinalGate } = req.body;

    if (!validateId(Number(id))) {
        return res.status(400).json({ error: ErrorMessagesSectionMiddleware.invalidIdFormat });
    }

    if (!validateNotNullorEmpty(newInitialGate) || !validateNotNullorEmpty(newFinalGate)) {
        return res.status(400).json({ error: ErrorMessagesSectionMiddleware.gateNotNull });
    }

    // Validazione della location
    if (!validateId(newFinalGate) || !validateId(newInitialGate)) {
        return res.status(400).json({ error: ErrorMessagesSectionMiddleware.invalidGateFormat });
    }

    // Se tutte le validazioni passano, passa al middleware successivo o al controller
    next();
}

// Middleware per la sanitizzazione dei parametri per DELETE
export function sanitizeDeleteSectionInputs(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;

    if (!validateId(Number(id))) {
        return res.status(400).json({ error: ErrorMessagesSectionMiddleware.invalidIdFormat });
    }

    // Se tutte le validazioni passano, passa al middleware successivo o al controller
    next();
}