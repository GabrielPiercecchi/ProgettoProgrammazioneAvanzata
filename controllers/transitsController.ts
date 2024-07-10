import { ErrorMessagesTransitController } from '../messages/errorMessages';
import { Transit, getAllTransits, getTransit, getAllNotFoundTickets } from '../models/transits';
import * as ticketController from './ticketsController';

// CREATE 
export const createTransit = async (plate: string, speed: number, weather: string, vehicles_types: string, gate: number): Promise<void> => {
    let result: any;
    try {
        const transit_date = new Date();
        result = await Transit.create({ plate, transit_date, speed, weather, vehicles_types, gate });
        // we should call the function to check and handle tickets
        ticketController.checkAndHandleTickets();
        return result;

    } catch (error) {
        if (error instanceof Error) {
            console.error(ErrorMessagesTransitController.creationError, error.message);
            throw new Error(`${ErrorMessagesTransitController.creationError} ${error.message}`);
        } else {
            console.error(ErrorMessagesTransitController.unknownCreationError, error);
            throw new Error(`${ErrorMessagesTransitController.unknownCreationError} ${error}`);
        }
    }
}

// Update 

export async function updateTransit(transitId: number, newPlate: string, newSpeed: number, newWeather: string, newVehicles_types: string, newGate: number): Promise<any> {
    let result: any;
    try {
        result = await Transit.findByPk(transitId);
        if (result) {
            // we should check if we respect the constraints
            result.plate = newPlate;
            result.transit_date = new Date();
            result.speed = newSpeed;
            result.weather = newWeather;
            result.vehicles_types = newVehicles_types;
            result.gate = newGate;
            //result.used = newUsed;

            await result.save();
            // we should call the function to check and handle tickets
            ticketController.checkAndHandleTickets();
            return result;
        } else {
            throw new Error('Transit not found.');
        }
    } catch (error) {
        if (error instanceof Error) {
            console.error(ErrorMessagesTransitController.updatingError, error.message);
            throw new Error(`${ErrorMessagesTransitController.updatingError} ${error.message}`);
        } else {
            console.error(ErrorMessagesTransitController.unknownUpdatingError, error);
            throw new Error(`${ErrorMessagesTransitController.unknownUpdatingError} ${error}`);
        }
    }
}

// Delete 

export async function deleteTransit(transitId: number): Promise<any> {
    try {
        const result = await Transit.findByPk(transitId);
        if (result) {
            await result.destroy();
            return `Transit with ID ${transitId} was deleted successfully.`;
        } else {
            throw new Error(`${ErrorMessagesTransitController.notFound}`);
        }
    } catch (error) {
        if (error instanceof Error) {
            console.error(ErrorMessagesTransitController.deletionError, error.message);
            throw new Error(`${ErrorMessagesTransitController.deletionError} ${error.message}`);
        } else {
            console.error(ErrorMessagesTransitController.unknownDeletionError, error);
            throw new Error(`${ErrorMessagesTransitController.unknownDeletionError} ${error}`);
        }
    }
}

export async function returnAllTransits(req: any, res: any): Promise<any> {
    try {
        const transits = await getAllTransits();
        res.status(200).json(transits);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: ErrorMessagesTransitController.unknownError });
        }
    }
}

export async function returnTransit(req: any, res: any, id: string): Promise<any> {
    try {
        // Convert id from string to number using parseInt with base 10
        const transitId = parseInt(id, 10);

        const transit = await getTransit(transitId);
        if (transit) {
            res.status(200).json(transit);
        } else {
            res.status(404).json({ error: ErrorMessagesTransitController.transitNotFound });
        }
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: ErrorMessagesTransitController.unknownError });
        }
    }
}

export async function returnCreateTransit(req: any, res: any, plate: string, speed: number, weather: string, vehicles_types: string, gate: number): Promise<any> {
    try {
        const newTransit = await createTransit(
            plate,
            speed,
            weather,
            vehicles_types,
            gate,
        );
        res.status(201).json(newTransit);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: ErrorMessagesTransitController.unknownError });
        }
    }
}

export async function returnUpdateTransit(req: any, res: any, id: string, newPlate: string, newSpeed: number, newWeather: string, newVehicles_types: string, newGate: number): Promise<any> {
    try {
        // Convert id from string to number using parseInt with base 10
        const transitId = parseInt(id, 10);
        const updatedTransit = await updateTransit(transitId, newPlate, newSpeed, newWeather, newVehicles_types, newGate);
        if (updatedTransit) {
            res.status(200).json(updatedTransit);
        } else {
            res.status(404).json({ error: ErrorMessagesTransitController.transitNotFound });
        }
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: ErrorMessagesTransitController.unknownError });
        }
    }
}

export async function returnDeleteTransit(req: any, res: any, id: string): Promise<any> {
    try {
        const transitId = parseInt(id, 10)
        const deletedTransit = await deleteTransit(transitId);
        res.status(200).json(deletedTransit);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: ErrorMessagesTransitController.unknownError });
        }
    }
}