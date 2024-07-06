import { Request, Response, NextFunction } from 'express';
import { validateSpeedLimit } from './vehiclesMiddleware';
import { validateLocation } from './gatesMiddleware';
import { validateId } from './sectionsMiddleware';


enum Weather {
    GoodWeather = 'good weather',
    BadWeather = 'bad weather'
}

function validatePlate(plate: string): boolean {
    const regex = /^[A-Z]{2}\d{3}[A-Z]{2}$/;
    return regex.test(plate);
}

function validateWeather(weather: string): boolean {
    return Object.values(Weather).includes(weather as Weather);
}

function validateVehicleType(vehicleType: any): boolean {
    return typeof vehicleType === 'string';
}
// Middleware for sanitizing the parameters for CREATE

export function sanitizeCreateTransitInput(req: Request, res: Response, next: NextFunction) {
    const { plate, speed, weather, vehicles_types, gate } = req.body;

    // Validation of the plate
    if(!validatePlate(plate)){
        return res.status(400).json({ error: 'Invalid plate format. Expected format: AA123AA' });
    }

    // Validation of the speed
    if(!validateSpeedLimit(speed)){
        return res.status(400).json({ error: 'Invalid speed. Speed must be an integer between 30 and 150.' });
    }

    // Validation of the weather
    if(!validateWeather(weather)){
        return res.status(400).json({ error: 'Invalid weather. Weather must be good weather or bad weather.' });
    }

    // Validation of the vehicles_types
    if(!validateVehicleType(vehicles_types)){
        return res.status(400).json({ error: 'Invalid vehicle type. Vehicle type must be a string.' });
    }

    // Validation of the gate
    if(!validateLocation(gate)){
        console.log(gate);
        return res.status(400).json({ error: 'Invalid gate format. Expected format: LAT43.615899LON13.518915' });
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
    if(!validateId(Number(id))){
        //console.log(typeof(transitId));
        return res.status(400).json({ error: 'Invalid id. Id must be an integer.' });
    }
    // Validation of the plate
    if(!validatePlate(newPlate)){
        return res.status(400).json({ error: 'Invalid plate format. Expected format: AA123AA' });
    }

    // Validation of the speed
    if(!validateSpeedLimit(newSpeed)){
        return res.status(400).json({ error: 'Invalid speed. Speed must be an integer between 30 and 150.' });
    }

    // Validation of the weather
    if(!validateWeather(newWeather)){
        return res.status(400).json({ error: 'Invalid weather. Weather must be good weather or bad weather.' });
    }

    // Validation of the vehicles_types
    if(!validateVehicleType(newVehicles_types)){
        return res.status(400).json({ error: 'Invalid vehicle type. Vehicle type must be a string.' });
    }

    // Validation of the gate
    if(!validateLocation(newGate)){
        //console.log(gate);
        return res.status(400).json({ error: 'Invalid gate format. Expected format: LAT43.615899LON13.518915' });
    }

    // If all validations pass, it moves on
    next();
}

export function sanitizeDeleteTransitInput(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    //console.log(typeof(id));
    // Validation of id
    //console.log(typeof(transitId));
    if(!validateId(Number(id))){
        //console.log(typeof(transitId));
        return res.status(400).json({ error: 'Invalid id. Id must be an integer.' });
    }
    // If all validations pass, it moves on
    next();
}