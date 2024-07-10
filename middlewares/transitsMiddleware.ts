import { Request, Response, NextFunction } from 'express';
import { validateId } from './sectionsMiddleware'; // we choose to import it cause its the same
import { validateNotNullorEmpty } from './vehiclesMiddleware'; // we choose to import it cause its the same
import { ErrorMessagesTransitMiddleware } from '../messages/errorMessages';

enum Weather {
    GoodWeather = 'good weather',
    BadWeather = 'bad weather'
}

function validatePlate(plate: string): boolean {
    const regex = /^[A-Z]{2}\d{3}[A-Z]{2}$/;
    return regex.test(plate);
}

function validateSpeedLimit(speed: number): boolean {
    return typeof speed === 'number';
}

function validateWeather(weather: string): boolean {
    return Object.values(Weather).includes(weather as Weather);
}

function validateVehicleType(vehicleType: any): boolean {
    return typeof vehicleType === 'string';
}
// Middleware for sanitizing the parameters for CREATE

export function sanitizeCreateTransitInputs(req: Request, res: Response, next: NextFunction) {
    const { plate, speed, weather, vehicles_types, gate } = req.body;

    if (!validateNotNullorEmpty(plate) || !validateNotNullorEmpty(speed) || !validateNotNullorEmpty(weather) || !validateNotNullorEmpty(vehicles_types) || !validateNotNullorEmpty(gate)) {
        return res.status(400).json({ error: ErrorMessagesTransitMiddleware.plateSpeedWeatherVehiclesTypesGateNotNullOrEmpty });
    }
    // Validation of the plate
    if (!validatePlate(plate) && !(plate === "notFound")) {
        return res.status(400).json({ error: ErrorMessagesTransitMiddleware.invalidPlateFormat });
    }

    // Validation of the speed
    if (!validateSpeedLimit(speed) || !(speed > 0)) {
        return res.status(400).json({ error: ErrorMessagesTransitMiddleware.invalidSpeedFormat });
    }

    // Validation of the weather
    if (!validateWeather(weather)) {
        return res.status(400).json({ error: ErrorMessagesTransitMiddleware.invalidWeatherFormat });
    }

    // Validation of the vehicles_types
    if (!validateVehicleType(vehicles_types)) {
        return res.status(400).json({ error: ErrorMessagesTransitMiddleware.invalidVehiclesTypesFormat });
    }

    // Validation of the gate
    if (!validateId(gate)) {
        console.log(gate);
        return res.status(400).json({ error: ErrorMessagesTransitMiddleware.invalidGateFormat });
    }

    // If all validations pass, it moves on
    next();

};

export function sanitizeUpdateTransitInputs(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    //console.log(typeof(id));
    const { newPlate, newSpeed, newWeather, newVehicles_types, newGate } = req.body;

    // Validation of id
    //console.log(typeof(transitId));
    if (!validateId(Number(id))) {
        //console.log(typeof(transitId));
        return res.status(400).json({ error: ErrorMessagesTransitMiddleware.invalidPlateFormat });
    }

    if (!validateNotNullorEmpty(newPlate) || !validateNotNullorEmpty(newSpeed) || !validateNotNullorEmpty(newWeather) || !validateNotNullorEmpty(newVehicles_types) || !validateNotNullorEmpty(newGate)) {
        return res.status(400).json({ error: ErrorMessagesTransitMiddleware.newPlateSpeedWeatherVehiclesTypesGateNotNullOrEmpty });
    }
    // Validation of the plate
    if (!validatePlate(newPlate) && !(newPlate === "notFound")) {
        return res.status(400).json({ error: ErrorMessagesTransitMiddleware.invalidPlateFormat });
    }

    // Validation of the speed
    if (!validateSpeedLimit(newSpeed) || !(newSpeed > 0)) {
        return res.status(400).json({ error: ErrorMessagesTransitMiddleware.invalidSpeedFormat });
    }

    // Validation of the weather
    if (!validateWeather(newWeather)) {
        return res.status(400).json({ error: ErrorMessagesTransitMiddleware.invalidWeatherFormat });
    }

    // Validation of the vehicles_types
    if (!validateVehicleType(newVehicles_types)) {
        return res.status(400).json({ error: ErrorMessagesTransitMiddleware.invalidVehiclesTypesFormat });
    }

    // Validation of the gate
    if (!validateId(newGate)) {
        //console.log(gate);
        return res.status(400).json({ error: ErrorMessagesTransitMiddleware.invalidGateFormat });
    }

    // If all validations pass, it moves on
    next();
}

// Middleware for sanitizing the parameters for DELETE

export function sanitizeDeleteTransitInputs(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    //console.log(typeof(id));
    // Validation of id
    //console.log(typeof(transitId));
    if (!validateId(Number(id))) {
        //console.log(typeof(transitId));
        return res.status(400).json({ error: ErrorMessagesTransitMiddleware.invalidId });
    }
    // If all validations pass, it moves on
    next();
}

// Middleware for sanitizing the parameters for GET

export function sanitizeGetTransitInputs(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    //console.log(typeof(id));
    // Validation of id
    //console.log(typeof(transitId));
    if (!validateId(Number(id))) {
        //console.log(typeof(transitId));
        return res.status(400).json({ error: ErrorMessagesTransitMiddleware.invalidId });
    }
    // If all validations pass, it moves on
    next();
}