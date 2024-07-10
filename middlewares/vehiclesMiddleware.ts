import { Request, Response, NextFunction } from 'express';
import { ErrorMessagesVehicleMiddleware } from '../messages/errorMessages';

// Funzione di validazione per il limite di velocità
export function validateSpeedLimit(limit: number): boolean {
    return Number.isInteger(limit) && limit >= 30 && limit <= 150;
}

// Funzione di validazione per il tipo
function validateType(type: string): boolean {
    const regex = /^[a-zA-Z][a-zA-Z0-9]*$/;
    return regex.test(type) && isNaN(Number(type));
}

// Params cant be null
export function validateNotNullorEmpty(value: any): boolean {
    return value !== null && value !== undefined && value !== '';
}

// Middleware per la sanitizzazione dei parametri per GET
export function sanitizeGetVehicleInputs(req: Request, res: Response, next: NextFunction) {
    const { type } = req.params;

    // Validazione del tipo
    if (!validateType(type)) {
        return res.status(400).json({ error: ErrorMessagesVehicleMiddleware.invalidTypeFormat });
    }

    // Se tutte le validazioni passano, passa al middleware successivo o al controller
    next();
}

// Middleware per la sanitizzazione dei parametri per CREATE
export function sanitizeCreateVehicleInputs(req: Request, res: Response, next: NextFunction) {
    const { type, limit } = req.body;

    if (!validateNotNullorEmpty(type) || !validateNotNullorEmpty(limit)) {
        return res.status(400).json({ error: ErrorMessagesVehicleMiddleware.typeNotNullOrEmpty});
    }

    // Validazione del tipo
    if (!validateType(type)) {
        return res.status(400).json({ error: ErrorMessagesVehicleMiddleware.invalidTypeFormat });
    }

    // Validazione del limite di velocità
    if (!validateSpeedLimit(limit)) {
        return res.status(400).json({ error: ErrorMessagesVehicleMiddleware.invalidSpeedLimit });
    }

    // Se tutte le validazioni passano, passa al middleware successivo o al controller
    next();
}

// Middleware per la sanitizzazione dei parametri per UPDATE
export function sanitizeUpdateVehicleInputs(req: Request, res: Response, next: NextFunction) {
    const { newLimit } = req.body;

    if (!validateNotNullorEmpty(newLimit)) {
        return res.status(400).json({ error: ErrorMessagesVehicleMiddleware.newLimitNotNullOrEmpty });
    }

    // Validazione del nuovo limite di velocità
    if (!validateSpeedLimit(newLimit)) {
        return res.status(400).json({ error: ErrorMessagesVehicleMiddleware.invalidSpeedLimit });
    }

    // Se tutte le validazioni passano, passa al middleware successivo o al controller
    next();
}

// Middleware per la sanitizzazione dei parametri per DELETE
export function sanitizeDeleteVehicleInputs(req: Request, res: Response, next: NextFunction) {
    const { type } = req.params;

    // Validazione del tipo
    if (!validateType(type)) {
        return res.status(400).json({ error: ErrorMessagesVehicleMiddleware.invalidTypeFormat });
    }

    // Se tutte le validazioni passano, passa al middleware successivo o al controller
    next();
}
