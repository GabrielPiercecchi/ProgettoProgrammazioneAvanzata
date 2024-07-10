import { Request, Response, NextFunction } from 'express';
<<<<<<< HEAD
import { validateId } from './sectionsMiddleware'; // We import it because it's the same
import { validateNotNullorEmpty } from './vehiclesMiddleware'; // We import it because it's the same
import { ErrorMessagesTransitMiddleware } from '../errorMessages/errorMessages';
=======
import { validateId } from './sectionsMiddleware'; // we choose to import it cause its the same
import { validateNotNullorEmpty } from './vehiclesMiddleware'; // we choose to import it cause its the same
import { ErrorMessagesTransitMiddleware } from '../messages/errorMessages';
>>>>>>> gabriel

enum Weather {
    GoodWeather = 'good weather',
    BadWeather = 'bad weather'
}

/**
 * Validates if the given plate number matches the specified format.
 * 
 * @param {string} plate - The plate number to validate.
 * @returns {boolean} true if the plate number matches the format; false otherwise.
 */
function validatePlate(plate: string): boolean {
    const regex = /^[A-Z]{2}\d{3}[A-Z]{2}$/;
    return regex.test(plate);
}

/**
 * Validates if the given speed is a valid number.
 * 
 * @param {number} speed - The speed value to validate.
 * @returns {boolean} true if the speed is a valid number; false otherwise.
 */
function validateSpeedLimit(speed: number): boolean {
    return typeof speed === 'number';
}

/**
 * Validates if the given weather condition is valid.
 * 
 * @param {string} weather - The weather condition to validate.
 * @returns {boolean} true if the weather condition is valid ('good weather' or 'bad weather'); false otherwise.
 */
function validateWeather(weather: string): boolean {
    return Object.values(Weather).includes(weather as Weather);
}

/**
 * Validates if the given vehicle type is a string.
 * 
 * @param {any} vehicleType - The vehicle type to validate.
 * @returns {boolean} true if the vehicle type is a string; false otherwise.
 */
function validateVehicleType(vehicleType: any): boolean {
    return typeof vehicleType === 'string';
}

/**
 * Middleware function to sanitize inputs for creating a transit record.
 * 
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next function to call in the middleware chain.
 */
export function sanitizeCreateTransitInputs(req: Request, res: Response, next: NextFunction) {
    const { plate, speed, weather, vehicles_types, gate } = req.body;

    if (!validateNotNullorEmpty(plate) || !validateNotNullorEmpty(speed) || !validateNotNullorEmpty(weather) || !validateNotNullorEmpty(vehicles_types) || !validateNotNullorEmpty(gate)) {
        return res.status(400).json({ error: ErrorMessagesTransitMiddleware.plateSpeedWeatherVehiclesTypesGateNotNullOrEmpty });
    }

    if (!validatePlate(plate) && !(plate === "notFound")) {
        return res.status(400).json({ error: ErrorMessagesTransitMiddleware.invalidPlateFormat });
    }

    if (!validateSpeedLimit(speed) || !(speed > 0)) {
        return res.status(400).json({ error: ErrorMessagesTransitMiddleware.invalidSpeedFormat });
    }

    if (!validateWeather(weather)) {
        return res.status(400).json({ error: ErrorMessagesTransitMiddleware.invalidWeatherFormat });
    }

    if (!validateVehicleType(vehicles_types)) {
        return res.status(400).json({ error: ErrorMessagesTransitMiddleware.invalidVehiclesTypesFormat });
    }

    if (!validateId(gate)) {
        console.log(gate);
        return res.status(400).json({ error: ErrorMessagesTransitMiddleware.invalidGateFormat });
    }

    next();
};

/**
 * Middleware function to sanitize inputs for updating a transit record.
 * 
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next function to call in the middleware chain.
 */
export function sanitizeUpdateTransitInputs(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const { newPlate, newSpeed, newWeather, newVehicles_types, newGate } = req.body;

    if (!validateId(Number(id))) {
        return res.status(400).json({ error: ErrorMessagesTransitMiddleware.invalidPlateFormat });
    }

    if (!validateNotNullorEmpty(newPlate) || !validateNotNullorEmpty(newSpeed) || !validateNotNullorEmpty(newWeather) || !validateNotNullorEmpty(newVehicles_types) || !validateNotNullorEmpty(newGate)) {
        return res.status(400).json({ error: ErrorMessagesTransitMiddleware.newPlateSpeedWeatherVehiclesTypesGateNotNullOrEmpty });
    }

    if (!validatePlate(newPlate) && !(newPlate === "notFound")) {
        return res.status(400).json({ error: ErrorMessagesTransitMiddleware.invalidPlateFormat });
    }

    if (!validateSpeedLimit(newSpeed) || !(newSpeed > 0)) {
        return res.status(400).json({ error: ErrorMessagesTransitMiddleware.invalidSpeedFormat });
    }

    if (!validateWeather(newWeather)) {
        return res.status(400).json({ error: ErrorMessagesTransitMiddleware.invalidWeatherFormat });
    }

    if (!validateVehicleType(newVehicles_types)) {
        return res.status(400).json({ error: ErrorMessagesTransitMiddleware.invalidVehiclesTypesFormat });
    }

    if (!validateId(newGate)) {
        return res.status(400).json({ error: ErrorMessagesTransitMiddleware.invalidGateFormat });
    }

    next();
}

/**
 * Middleware function to sanitize inputs for deleting a transit record.
 * 
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next function to call in the middleware chain.
 */
export function sanitizeDeleteTransitInputs(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;

    if (!validateId(Number(id))) {
        return res.status(400).json({ error: ErrorMessagesTransitMiddleware.invalidId });
    }

    next();
}

/**
 * Middleware function to sanitize inputs for retrieving a transit record.
 * 
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next function to call in the middleware chain.
 */
export function sanitizeGetTransitInputs(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;

    if (!validateId(Number(id))) {
        return res.status(400).json({ error: ErrorMessagesTransitMiddleware.invalidId });
    }

    next();
}
