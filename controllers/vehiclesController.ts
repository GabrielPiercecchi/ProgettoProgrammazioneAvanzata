import { Op } from 'sequelize';
import { Vehicle, getAllVehicles, getVehicles } from '../models/vehicles';
import { ErrorMessagesVehicleController } from '../errorMessages/errorMessages';

// CREATE
/**
 * This function creates a new vehicle in the database
 * 
 * @param {string} type - The type of the vehicle to create
 * @param {number} limit - The limit value for the vehicle
 * @returns {Promise<any>} - A promise that resolves to the created vehicle data
 * @throws {Error} - Throws an error if there is an issue creating the vehicle
 */
export async function createVehicle(type: string, limit: number): Promise<any> {
  let result: any;
  try {
    // Check if a vehicle with the same type (case-insensitive) already exists
    const existingVehicle = await Vehicle.findOne({
      where: {
        [Op.or]: [
          { type: type.toLowerCase() },
          { type: type.charAt(0).toUpperCase() + type.slice(1).toLowerCase() }
        ]
      }
    });

    if (existingVehicle) {
      throw new Error(`${ErrorMessagesVehicleController.alreadyExists} ${type}`);
    }

    // If not exists, create the new vehicle
    result = await Vehicle.create({ type, limit });
    return result;
  } catch (error) {
    if (error instanceof Error) {
      console.error(ErrorMessagesVehicleController.createVehicle, error.message);
      throw new Error(`${ErrorMessagesVehicleController.createVehicle} ${error.message}`);
    } else {
      console.error(ErrorMessagesVehicleController.unknownError, error);
      throw new Error(`${ErrorMessagesVehicleController.unknownError} ${error}`);
    }
  }
}

// UPDATE
/**
 * This function updates the limit of a specific vehicle in the database
 * 
 * @param {string} type - The type of the vehicle to update
 * @param {number} newLimit - The new limit value for the vehicle
 * @returns {Promise<any>} - A promise that resolves to the updated vehicle data
 * @throws {Error} - Throws an error if there is an issue updating the vehicle
 */
export async function updateVehicle(type: string, newLimit: number): Promise<any> {
  let result: any;

  try {
    // Find the vehicle with type case-insensitive
    result = await Vehicle.findOne({
      where: {
        [Op.or]: [
          { type: type.toLowerCase() },
          { type: type.charAt(0).toUpperCase() + type.slice(1).toLowerCase() }
        ]
      }
    });

    // pk can't be modified
    if (result) {
      result.limit = newLimit;
      await result.save();
      return result;
    } else {
      throw new Error(`${ErrorMessagesVehicleController.vehicleNotFound} ${type}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(ErrorMessagesVehicleController.updateVehicle, error.message);
      throw new Error(`${ErrorMessagesVehicleController.updateVehicle} ${error.message}`);
    } else {
      console.error(ErrorMessagesVehicleController.unknownError, error);
      throw new Error(`${ErrorMessagesVehicleController.unknownError} ${error}`);
    }
  }
}

// DELETE
/**
 * This function deletes a specific vehicle from the database
 * 
 * @param {string} type - The type of the vehicle to delete
 * @returns {Promise<any>} - A promise that resolves to a success message or an error
 * @throws {Error} - Throws an error if there is an issue deleting the vehicle
 */
export async function deleteVehicle(type: string): Promise<any> {
  let result: any;
  try {
    // Find the vehicle with type case-insensitive
    result = await Vehicle.findOne({
      where: {
        [Op.or]: [
          { type: type.toLowerCase() },
          { type: type.charAt(0).toUpperCase() + type.slice(1).toLowerCase() }
        ]
      }
    });
    if (result) {
      await result.destroy();
      return `Vehicle with type ${type} was deleted successfully.`;
    } else {
      throw new Error(`${ErrorMessagesVehicleController.vehicleNotFound} ${type}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(ErrorMessagesVehicleController.deleteVehicle, error.message);
      throw new Error(`${ErrorMessagesVehicleController.deleteVehicle} ${error.message}`);
    } else {
      console.error(ErrorMessagesVehicleController.unknownError, error);
      throw new Error(`${ErrorMessagesVehicleController.unknownError} ${error}`);
    }
  }
}

// GET ALL VEHICLES
/**
 * This function returns all the vehicles in the database
 * 
 * @param {any} req - The request object
 * @param {any} res - The response object
 * @returns {Promise<any>} - A promise that resolves to an array of all vehicle data
 * @throws {Error} - Throws an error if there is an issue fetching the vehicles
 */
export async function returnAllVehicles(req: any, res: any): Promise<any> {
  try {
    const vehicles = await getAllVehicles();
    res.status(200).json(vehicles);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: ErrorMessagesVehicleController.unknownError });
    }
  }
}

// GET A SPECIFIC VEHICLE
/**
 * This function returns a specific vehicle from the database based on the type provided as a parameter
 * 
 * @param {any} req - The request object
 * @param {any} res - The response object
 * @param {string} type - The type of the vehicle to fetch
 * @returns {Promise<any>} - A promise that resolves to the vehicle data or null if not found
 * @throws {Error} - Throws an error if there is an issue fetching the vehicle
 */
export async function returnVehicle(req: any, res: any, type: string): Promise<any> {
  try {
    const vehicle = await getVehicles(type);
    if (vehicle) {
      res.status(200).json(vehicle);
    } else {
      res.status(404).json({ error: ErrorMessagesVehicleController.vehicleNotFound });
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: ErrorMessagesVehicleController.unknownError });
    }
  }
}

// CREATE A VEHICLE
/**
 * This function creates a new vehicle and returns the created vehicle data
 * 
 * @param {any} req - The request object
 * @param {any} res - The response object
 * @param {string} type - The type of the vehicle to create
 * @param {number} limit - The limit value for the vehicle
 * @returns {Promise<any>} - A promise that resolves to the created vehicle data
 * @throws {Error} - Throws an error if there is an issue creating the vehicle
 */
export async function returnCreateVehicle(req: any, res: any, type: string, limit: number) {
  try {
    const newVehicle = await createVehicle(type, limit);
    res.status(201).json(newVehicle);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: ErrorMessagesVehicleController.unknownError });
    }
  }
}

// UPDATE A VEHICLE
/**
 * This function updates the limit of a specific vehicle and returns the updated vehicle data
 * 
 * @param {any} req - The request object
 * @param {any} res - The response object
 * @param {string} type - The type of the vehicle to update
 * @param {number} newLimit - The new limit value for the vehicle
 * @returns {Promise<any>} - A promise that resolves to the updated vehicle data
 * @throws {Error} - Throws an error if there is an issue updating the vehicle
 */
export async function returnUpdateVehicle(req: any, res: any, type: string, newLimit: number) {
  try {
    const updatedVehicle = await updateVehicle(type, newLimit);
    res.status(201).json(updatedVehicle);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: ErrorMessagesVehicleController.unknownError });
    }
  }
}

// DELETE A VEHICLE
/**
 * This function deletes a specific vehicle and returns a success message
 * 
 * @param {any} req - The request object
 * @param {any} res - The response object
 * @param {string} type - The type of the vehicle to delete
 * @returns {Promise<any>} - A promise that resolves to a success message or an error
 * @throws {Error} - Throws an error if there is an issue deleting the vehicle
 */
export async function returnDeleteVehicle(req: any, res: any, type: string) {
  try {
    const deletedVehicle = await deleteVehicle(type);
    res.status(200).json(deletedVehicle);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: ErrorMessagesVehicleController.unknownError });
    }
  }
}
