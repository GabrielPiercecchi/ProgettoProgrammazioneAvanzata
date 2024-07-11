import { ErrorMessagesTransitController } from '../messages/errorMessages';
import { SuccessMessagesGateController, SuccessMessagesTransitController } from '../messages/successMessages';
import { Transit, getAllTransits, getTransit, getAllNotFoundTickets } from '../models/transits';
import * as ticketController from './ticketsController';

/**
 * Create a new transit record in the database.
 * 
 * @param {string} plate - The plate number of the vehicle for the transit.
 * @param {number} speed - The speed of the vehicle during the transit.
 * @param {string} weather - The weather condition during the transit ('good weather' or 'bad weather').
 * @param {string} vehicles_types - The type of vehicle for the transit.
 * @param {number} gate - The ID of the gate where the transit occurred.
 * @returns {Promise<void>} A promise that resolves when the transit is successfully created.
 * @throws {Error} If an error occurs during the creation process.
 */
export const createTransit = async (plate: string, speed: number, weather: string, vehicles_types: string, gate: number): Promise<void> => {
    let result: any;
    try {
        const transit_date = new Date();
        result = await Transit.create({ plate, transit_date, speed, weather, vehicles_types, gate });
        // Invoke function to check and handle tickets
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

/**
 * Update an existing transit record in the database.
 * 
 * @param {number} transitId - The ID of the transit to update.
 * @param {string} newPlate - The new plate number for the transit.
 * @param {number} newSpeed - The new speed for the transit.
 * @param {string} newWeather - The new weather condition for the transit.
 * @param {string} newVehicles_types - The new type of vehicle for the transit.
 * @param {number} newGate - The new gate ID for the transit.
 * @returns {Promise<any>} A promise that resolves to the updated transit object.
 * @throws {Error} If the transit with the specified ID is not found or if an error occurs during the update process.
 */
export async function updateTransit(transitId: number, newPlate: string, newSpeed: number, newWeather: string, newVehicles_types: string, newGate: number): Promise<any> {
    let result: any;
    try {
        result = await Transit.findByPk(transitId);
        if (result) {
            // Check if constraints are respected
            result.plate = newPlate;
            result.transit_date = new Date();
            result.speed = newSpeed;
            result.weather = newWeather;
            result.vehicles_types = newVehicles_types;
            result.gate = newGate;

            await result.save();
            // Invoke function to check and handle tickets
            ticketController.checkAndHandleTickets();
            return result;
        } else {
            throw new Error(`${ErrorMessagesTransitController.transitNotFound}`);
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

/**
 * Delete a transit record from the database.
 * 
 * @param {number} transitId - The ID of the transit to delete.
 * @returns {Promise<any>} A promise that resolves to a success message upon successful deletion.
 * @throws {Error} If the transit with the specified ID is not found or if an error occurs during the deletion process.
 */
export async function deleteTransit(transitId: number): Promise<any> {
    try {
        const result = await Transit.findByPk(transitId);
        if (result) {
            await result.destroy();
            return `${SuccessMessagesTransitController.deleteSuccess} ${transitId}`;
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

/**
 * Retrieve all transits from the database and send the response.
 * 
 * @param {any} req - The request object.
 * @param {any} res - The response object.
 * @returns {Promise<any>} A promise that resolves when all transits are retrieved and sent as a response.
 */
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

/**
 * Retrieve a transit by its ID from the database and send the response.
 * 
 * @param {any} req - The request object.
 * @param {any} res - The response object.
 * @param {string} id - The ID of the transit to retrieve.
 * @returns {Promise<any>} A promise that resolves when the transit is retrieved and sent as a response.
 */
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

/**
 * Create a new transit record in the database and send the response.
 * 
 * @param {any} req - The request object.
 * @param {any} res - The response object.
 * @param {string} plate - The plate number of the vehicle for the transit.
 * @param {number} speed - The speed of the vehicle during the transit.
 * @param {string} weather - The weather condition during the transit ('good weather' or 'bad weather').
 * @param {string} vehicles_types - The type of vehicle for the transit.
 * @param {number} gate - The ID of the gate where the transit occurred.
 * @returns {Promise<any>} A promise that resolves when the transit is successfully created and sent as a response.
 */
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

/**
 * Update an existing transit record in the database and send the response.
 * 
 * @param {any} req - The request object.
 * @param {any} res - The response object.
 * @param {string} id - The ID of the transit to update.
 * @param {string} newPlate - The new plate number for the transit.
 * @param {number} newSpeed - The new speed for the transit.
 * @param {string} newWeather - The new weather condition for the transit.
 * @param {string} newVehicles_types - The new type of vehicle for the transit.
 * @param {number} newGate - The new gate ID for the transit.
 * @returns {Promise<any>} A promise that resolves when the transit is successfully updated and sent as a response.
 */
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

/**
 * Delete a transit record from the database and send the response.
 * 
 * @param {any} req - The request object.
 * @param {any} res - The response object.
 * @param {string} id - The ID of the transit to delete.
 * @returns {Promise<any>} A promise that resolves when the transit is successfully deleted and sends a success message as a response.
 */
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
