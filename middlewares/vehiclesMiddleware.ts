import { Request, Response, NextFunction } from 'express';

// Funzione di validazione per il limite di velocità
function validateSpeedLimit(limit: number): boolean {
    return Number.isInteger(limit) && limit >= 30 && limit <= 150;
}

// Middleware per la sanitizzazione dei parametri per CREATE
export function sanitizeCreateVehicleInputs(req: Request, res: Response, next: NextFunction) {
    const { type, limit } = req.body;

    // Validazione del limite di velocità
    if (!validateSpeedLimit(limit)) {
        return res.status(400).json({ error: 'Invalid speed limit. Speed limit must be an integer between 30 and 150.' });
    }

    // Se tutte le validazioni passano, passa al middleware successivo o al controller
    next();
}

// Middleware per la sanitizzazione dei parametri per UPDATE
export function sanitizeUpdateVehicleInputs(req: Request, res: Response, next: NextFunction) {
    const { newLimit } = req.body;

    // Validazione del nuovo limite di velocità
    if (!validateSpeedLimit(newLimit)) {
        return res.status(400).json({ error: 'Invalid speed limit. Speed limit must be an integer between 30 and 150.' });
    }

    // Se tutte le validazioni passano, passa al middleware successivo o al controller
    next();
}
