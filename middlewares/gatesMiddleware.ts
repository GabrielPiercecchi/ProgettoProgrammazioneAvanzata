import { Request, Response, NextFunction } from 'express';

// Funzione di validazione per la location
export function validateLocation(location: string): boolean {
    const regex = /^LAT-?\d{2}\.\d{6}LON-?\d{2}\.\d{6}$/;
    return regex.test(location);
}

// Funzione di validazione per l'username
function validateUsername(username: string): boolean {
    const regex = /^[a-zA-Z][a-zA-Z0-9]*$/;
    return regex.test(username) && isNaN(Number(username));
}

// Middleware per la sanitizzazione dei parametri per GET
export function sanitizeGetGateInputs(req: Request, res: Response, next: NextFunction) {
    const { username } = req.params;

    // Validazione della location
    if (!validateUsername(username)) {
        return res.status(400).json({ error: 'Invalid username. Id must be an string.' });
    }

    // Se tutte le validazioni passano, passa al middleware successivo o al controller
    next();
}

// Middleware per la sanitizzazione dei parametri per DELETE
export function sanitizeDeleteGateInputs(req: Request, res: Response, next: NextFunction) {
    const { username } = req.params;

    // Validazione della location
    if (!validateUsername(username)) {
        return res.status(400).json({ error: 'Invalid username. Id must be an string.' });
    }

    // Se tutte le validazioni passano, passa al middleware successivo o al controller
    next();
}

// Middleware per la sanitizzazione dei parametri per CREATE
export function sanitizeCreateGateInputs(req: Request, res: Response, next: NextFunction) {
    const { location, username, password } = req.body;

    // Validazione della location
    if (!validateLocation(location)) {
        return res.status(400).json({ error: 'Invalid location format. Expected format: LAT43.6158299LON13.518915' });
    }

    // Validazione dell'username
    if (!validateUsername(username)) {
        return res.status(400).json({ error: 'Invalid username format. Username must start with a letter and cannot be numeric only.' });
    }

    // Validazione della password
    if (!password || password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    // Se tutte le validazioni passano, passa al middleware successivo o al controller
    next();
}

// Middleware per la sanitizzazione dei parametri per UPDATE
export function sanitizeUpdateGateInputs(req: Request, res: Response, next: NextFunction) {
    const { location } = req.params;
    const { newUsername, newPassword } = req.body;

    // Validazione della location
    if (!validateLocation(location)) {
        return res.status(400).json({ error: 'Invalid location format. Expected format: LAT43.6158299LON13.518915' });
    }

    // Validazione del nuovo username
    if (newUsername && !validateUsername(newUsername)) {
        return res.status(400).json({ error: 'Invalid username format. Username must start with a letter and cannot be numeric only.' });
    }

    // Validazione della nuova password
    if (newPassword && newPassword.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    // Se tutte le validazioni passano, passa al middleware successivo o al controller
    next();
}