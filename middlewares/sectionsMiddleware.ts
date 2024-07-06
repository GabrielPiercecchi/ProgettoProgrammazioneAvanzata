import { Request, Response, NextFunction } from 'express';

// Funzione di validazione per la location
function validateLocation(location: string): boolean {
    const regex = /^LAT-?\d{2}\.\d{6}LON-?\d{2}\.\d{6}$/;
    return regex.test(location);
}

// Funzione di validazione per id
function validateId(id: number): boolean {
    return Number.isInteger(id);
}

// Middleware per la sanitizzazione dei parametri per GET
export function sanitizeGetSectionInputs(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;

    // Validazione della location
    if (!validateId(Number(id))) {
        return res.status(400).json({ error: 'Invalid id. Id must be an integer.' });
    }

    // Se tutte le validazioni passano, passa al middleware successivo o al controller
    next();
}

// Middleware per la sanitizzazione dei parametri per CREATE
export function sanitizeCreateSectionInputs(req: Request, res: Response, next: NextFunction) {
    const {initialGate, finalGate } = req.body;

    // Validazione della location
    if (!validateLocation(initialGate) || !validateLocation(finalGate)) {
        return res.status(400).json({ error: 'Invalid location format. Expected format: LAT43.6158299LON13.518915' });
    }

    // Se tutte le validazioni passano, passa al middleware successivo o al controller
    next();
}

// Middleware per la sanitizzazione dei parametri per UPDATE
export function sanitizeUpdateSectionInputs(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const { newInitialGate, newFinalGate } = req.body;  

    if (!validateId(Number(id))) {
        return res.status(400).json({ error: 'Invalid id. Id must be an integer.' });
    }

    // Validazione della location
    if (!validateLocation(newFinalGate) || !validateLocation(newInitialGate)) {
        return res.status(400).json({ error: 'Invalid location format. Expected format: LAT43.6158299LON13.518915' });
    }

    // Se tutte le validazioni passano, passa al middleware successivo o al controller
    next();
}

// Middleware per la sanitizzazione dei parametri per DELETE
export function sanitizeDeleteSectionInputs(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;

    if (!validateId(Number(id))) {
        return res.status(400).json({ error: 'Invalid id. Id must be an integer.' });
    }

    // Se tutte le validazioni passano, passa al middleware successivo o al controller
    next();
}