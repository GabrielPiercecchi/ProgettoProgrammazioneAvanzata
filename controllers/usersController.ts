import { DBIsConnected } from "../database/database";
import { Sequelize } from 'sequelize';
import { Gate } from '../models/gates';
import { User, getAllUsers, getUser } from '../models/users';
import { ErrorMessagesUserController } from '../messages/errorMessages';
import { SuccessMessagesUserController } from '../messages/successMessages';

// Connection to the database
const sequelize: Sequelize = DBIsConnected.getInstance();

/**
 * This function required a username for the creation of a new user with the role 'gate'
 * 
 * @param {string} username - The username for the new gate user
 * @returns {Promise<any>} - A promise that resolves to the newly created user object
 * @throws {Error} - Throws an error if there is an issue creating the user
 */
export async function createGateUser(username: string): Promise<any> {
    try {
        // Create a new user with role 'gate'
        const newUser = await User.create({
            username,
            role: "gate",
        });
        return newUser;
    } catch (error) {
        if (error instanceof Error) {
            console.error(ErrorMessagesUserController.createUser, error.message);
            throw new Error(`${ErrorMessagesUserController.createUser} ${error.message}`);
        } else {
            console.error(ErrorMessagesUserController.createUser, error);
            throw new Error(ErrorMessagesUserController.createUser);
        }
    }
}

/**
 * Delete a gate user from the database
 * 
 * @param {string} username - The username of the user to delete
 * @returns {Promise<any>} - A promise that resolves to a success message if deletion is successful
 * @throws {Error} - Throws an error if there is an issue deleting the user
 */
export async function deleteGateUser(username: string): Promise<any> {
    let result: any;
    try {
        // Find the user by username
        result = await User.findByPk(username);
        if (!result) {
            throw new Error(ErrorMessagesUserController.userNotFound);
        }

        // Check if the user has the role 'gate'
        if (result.role !== 'gate') {
            throw new Error(`${ErrorMessagesUserController.notUserGate}`);
        }

        // Delete the user
        await result.destroy();
        return `${SuccessMessagesUserController.deleteSuccess} ${username}`;
    } catch (error) {
        if (error instanceof Error) {
            console.error(ErrorMessagesUserController.deleteUser, error.message);
            throw new Error(`${ErrorMessagesUserController.deleteUser} ${error.message}`);
        } else {
            console.error(ErrorMessagesUserController.deleteUser, error);
            throw new Error(ErrorMessagesUserController.deleteUser);
        }
    }
}

/**
 * Update a gate user in the database
 * 
 * @param {string} username - The current username of the user to update
 * @param {string} newUsername - The new username for the user
 * @returns {Promise<any>} - A promise that resolves to the updated user object
 * @throws {Error} - Throws an error if there is an issue updating the user
 */
export async function updateGateUser(username: string, newUsername: string): Promise<any> {
    try {
        // Find the user by current username
        let user = await User.findOne({ where: { username } });
        if (!user) {
            return null;
        }

        // Update the username in both 'users' and 'gates' tables
        await User.update({ username: newUsername }, { where: { username } });
        await Gate.update({ username: newUsername }, { where: { username } });

        // Return the updated user
        return await User.findOne({ where: { username: newUsername } });
    } catch (error) {
        if (error instanceof Error) {
            console.error(ErrorMessagesUserController.updateUser, error.message);
            throw new Error(`${ErrorMessagesUserController.updateUser} ${error.message}`);
        } else {
            console.error(ErrorMessagesUserController.updateUser, error);
            throw new Error(ErrorMessagesUserController.updateUser);
        }
    }
}

/**
 * Return all users using getAllUser method as JSON response
 * 
 * @param {any} req - The request object
 * @param {any} res - The response object
 * @returns {Promise<any>} - A promise that resolves to a JSON response with all users
 */
export async function returnAllUsers(req: any, res: any): Promise<any> {
    try {
        // Get all users
        let users = await getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: `${ErrorMessagesUserController.unknownError} ${error.message}` });
        } else {
            res.status(500).json({ error: ErrorMessagesUserController.unknownError });
        }
    }
}

/**
 * Return the required user using the getUser method as JSON response
 * 
 * @param {any} req - The request object
 * @param {any} res - The response object
 * @param {string} username - The username of the user to fetch
 * @returns {Promise<any>} - A promise that resolves to a JSON response with the user data
 */
export async function returnGetUser(req: any, res: any, username: string): Promise<any> {
    try {
        // Get the user by username
        let user = await getUser(username);
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ error: ErrorMessagesUserController.userNotFound });
        }
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: `${ErrorMessagesUserController.unknownError} ${error.message}` });
        } else {
            res.status(500).json({ error: ErrorMessagesUserController.unknownError });
        }
    }
}

/**
 * Handle the request of creating a user with createGateUser method
 * 
 * @param {any} req - The request object
 * @param {any} res - The response object
 * @param {string} username - The username for the new gate user
 * @returns {Promise<any>} - A promise that resolves to a JSON response with the newly created user
 */
export async function returnCreateUser(req: any, res: any, username: string): Promise<any> {
    try {
        // Create a new gate user
        const newGateUser = await createGateUser(username);
        res.status(201).json(newGateUser);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: `${ErrorMessagesUserController.createUser} ${error.message}` });
        } else {
            res.status(500).json({ error: ErrorMessagesUserController.createUser });
        }
    }
}

/**
 * Handle the request of updating a user with updateGateUser method as JSON
 * 
 * @param {any} req - The request object
 * @param {any} res - The response object
 * @param {string} username - The current username of the user to update
 * @param {string} newUsername - The new username for the user
 * @returns {Promise<any>} - A promise that resolves to a JSON response with the updated user
 */
export async function returnUpdateUser(req: any, res: any, username: string, newUsername: string): Promise<any> {
    try {
        // Update a gate user
        let user = await updateGateUser(username, newUsername);
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ error: ErrorMessagesUserController.userNotFound });
        }
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: `${ErrorMessagesUserController.updateUser} ${error.message}` });
        } else {
            res.status(500).json({ error: ErrorMessagesUserController.updateUser });
        }
    }
}

/**
 * Handle the request of deleting a user with deleteGateUser method
 * 
 * @param {any} req - The request object
 * @param {any} res - The response object
 * @param {string} username - The username of the user to delete
 * @returns {Promise<any>} - A promise that resolves to a JSON response indicating success or error
 */
export async function returnDeleteUser(req: any, res: any, username: string): Promise<any> {
    try {
        // Delete a gate user
        let user = await deleteGateUser(username);
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ error: ErrorMessagesUserController.userNotFound });
        }
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: `${ErrorMessagesUserController.deleteUser} ${error.message}` });
        } else {
            res.status(500).json({ error: ErrorMessagesUserController.deleteUser });
        }
    }
}
