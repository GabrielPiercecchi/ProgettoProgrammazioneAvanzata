import { DBIsConnected } from '../database/database';
import { Sequelize } from 'sequelize';
import { Gate, getAllGates, getGates } from '../models/gates';
import { User } from '../models/users';
import { ErrorMessagesGateController } from '../messages/errorMessages';
import { SuccessMessagesGateController } from '../messages/successMessages';

// CONNECTION TO DATABASE
const sequelize: Sequelize = DBIsConnected.getInstance();

/**
 * This function creates a new gate in the database
 * 
 * @param {string} location - The location of the gate to create
 * @param {string} username - The username associated with the gate
 * @returns {Promise<any>} - A promise that resolves to the created gate data
 * @throws {Error} - Throws an error if there is an issue creating the gate or if the user is not found
 */
export async function createGate(location: string, username: string): Promise<any> {
  try {
    // Check if the user exists
    if (await User.findByPk(username) == null) {
      throw new Error(`${ErrorMessagesGateController.userNotFound} ${username}`);
    }

    // Create the new gate
    const newGate = await Gate.create({
      location,
      username,
    });
    return newGate;
  } catch (error) {
    if (error instanceof Error) {
      console.error(ErrorMessagesGateController.creationError, error.message);
      throw new Error(`${ErrorMessagesGateController.creationError} ${error.message}`);
    } else {
      console.error(ErrorMessagesGateController.unknownCreationError, error);
      throw new Error(`${ErrorMessagesGateController.unknownCreationError} ${error}`);
    }
  }
}

/**
 * This function updates the username of a specific gate in the database
 * 
 * @param {number} id - The ID of the gate to update
 * @param {string} newUsername - The new username to update
 * @returns {Promise<any>} - A promise that resolves to the updated gate data
 * @throws {Error} - Throws an error if there is an issue updating the gate or if the gate is not found
 */
export async function updateGate(id: number, newUsername: string): Promise<any> {
  let result: any;
  let user: any;
  try {
    result = await Gate.findByPk(id);
    user = await User.findByPk(newUsername, { raw: true });
    if (!user) {
      throw new Error(`${ErrorMessagesGateController.userNotFound} ${newUsername}`);
    }
    if (result) {
      result.username = newUsername;
      await result.save();
      return result;
    } else {
      throw new Error(`${ErrorMessagesGateController.gateNotFound} ${id}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(ErrorMessagesGateController.updatingError, error.message);
      throw new Error(`${ErrorMessagesGateController.updatingError} ${error.message}`);
    } else {
      console.error(ErrorMessagesGateController.unknownUpdatingError, error);
      throw new Error(`${ErrorMessagesGateController.unknownUpdatingError} ${error}`);
    }
  }
}

/**
 * This function deletes a specific gate from the database
 * 
 * @param {number} id - The ID of the gate to delete
 * @returns {Promise<any>} - A promise that resolves to a success message or an error
 * @throws {Error} - Throws an error if there is an issue deleting the gate or if the gate is not found
 */
export async function deleteGate(id: number): Promise<any> {
    let result: any;
    try {
        result = await Gate.findByPk(id);
        if (result) {
            // Cancella il gate
            await result.destroy();
            return SuccessMessagesGateController.deleteSuccess;
        } else {
          throw new Error(`${ErrorMessagesGateController.gateNotFound} ${id}`);
        }
    } catch (error) {
        if (error instanceof Error) {
            console.error(ErrorMessagesGateController.deletionError, error.message);
            throw new Error(`${ErrorMessagesGateController.deletionError} ${error.message}`);
        } else {
            console.error(ErrorMessagesGateController.unknownDeletionError, error);
            throw new Error(`${ErrorMessagesGateController.unknownDeletionError} ${error}`);
        }
    }
}

/**
 * This function returns all the gates in the database
 * 
 * @param {any} req - The request object
 * @param {any} res - The response object
 * @returns {Promise<any>} - A promise that resolves to an array of all gate data
 * @throws {Error} - Throws an error if there is an issue fetching the gates
 */
export async function returnAllGates(req: any, res: any): Promise<any> {
  try {
    const gates = await getAllGates();
    res.status(200).json(gates);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: ErrorMessagesGateController.unknownError });
    }
  }
}

/**
 * This function returns a specific gate from the database based on the ID provided as a parameter
 * 
 * @param {any} req - The request object
 * @param {any} res - The response object
 * @param {number} id - The ID of the gate to fetch
 * @returns {Promise<any>} - A promise that resolves to the gate data or null if not found
 * @throws {Error} - Throws an error if there is an issue fetching the gate
 */
export async function returnGate(req: any, res: any, id: number): Promise<any> {
  try {
    const gate = await getGates(id);
    if (gate) {
      res.status(200).json(gate);
    } else {
      res.status(404).json({ error: ErrorMessagesGateController.gateNotFound });
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: ErrorMessagesGateController.unknownError });
    }
  }
}

/**
 * This function creates a new gate and returns the created gate data
 * 
 * @param {any} req - The request object
 * @param {any} res - The response object
 * @param {string} location - The location of the gate to create
 * @param {string} username - The username associated with the gate
 * @returns {Promise<any>} - A promise that resolves to the created gate data
 * @throws {Error} - Throws an error if there is an issue creating the gate or if the user is not found
 */
export async function returnCreateGate(req: any, res: any, location: string, username: string): Promise<any> {
  try {
    const newGate = await createGate(location, username);
    res.status(201).json(newGate);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: ErrorMessagesGateController.unknownError });
    }
  }
}

/**
 * This function updates the username of a specific gate and returns the updated gate data
 * 
 * @param {any} req - The request object
 * @param {any} res - The response object
 * @param {number} id - The ID of the gate to update
 * @param {string} newUsername - The new username to update
 * @returns {Promise<any>} - A promise that resolves to the updated gate data
 * @throws {Error} - Throws an error if there is an issue updating the gate or if the gate is not found
 */
export async function returnUpdateGate(req: any, res: any, id: number, newUsername: string): Promise<any> {
  try {
    const updatedGate = await updateGate(id, newUsername);
    if (updatedGate) {
      res.status(200).json(updatedGate);
    } else {
      res.status(404).json({ error: ErrorMessagesGateController.gateNotFound });
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: ErrorMessagesGateController.unknownError });
    }
  }
}

/**
 * This function deletes a specific gate and returns a success message
 * 
 * @param {any} req - The request object
 * @param {any} res - The response object
 * @param {number} id - The ID of the gate to delete
 * @returns {Promise<any>} - A promise that resolves to a success message or an error
 * @throws {Error} - Throws an error if there is an issue deleting the gate or if the gate is not found
 */
export async function returnDeleteGate(req: any, res: any, id: number): Promise<any> {
  try {
    const gate = await deleteGate(id);
    if (gate) {
      res.status(200).json(gate);
    } else {
      res.status(404).json({ error: ErrorMessagesGateController.gateNotFound });
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: ErrorMessagesGateController.unknownError });
    }
  }
}
