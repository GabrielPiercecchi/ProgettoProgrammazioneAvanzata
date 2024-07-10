import { DBIsConnected } from "../database/database";
import { DataTypes, Sequelize } from 'sequelize';
import { ErrorMessagesUserModel } from '../messages/errorMessages';

// Connection to the database
const sequelize: Sequelize = DBIsConnected.getInstance();

/**
 * Model 'User'
 *
 * Defines the model 'User' to interface with the "users" table
 */
export const User = sequelize.define('users', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
    },
    role: {
        type: DataTypes.ENUM('operator', 'gate', 'driver'),
        defaultValue: 'operator',
    },
    token: {
        type: DataTypes.INTEGER,
        defaultValue: 10,
    }
},
{
    modelName: 'users',
    timestamps: false,
});

/**
 * This function return a user from the database based on the username provided as a parameter
 * 
 * @param {string} username - The username of the user to fetch
 * @returns {Promise<any>} - A promise that resolves to the user data or null if not found
 * @throws {Error} - Throws an error if there is an issue fetching the user
 */
export async function getUser(username: string): Promise<any> {
    let result: any;
    try {
        // Convert the parameter to lowercase for the search
        result = await User.findByPk(username, { raw: true });

        return result;
    } catch (error) {
        if (error instanceof Error) {
            console.error(ErrorMessagesUserModel.fetchError, error.message);
            throw new Error(`${ErrorMessagesUserModel.fetchError} ${error.message}`);
        } else {
            console.error(ErrorMessagesUserModel.unknownFetchError, error);
            throw new Error(ErrorMessagesUserModel.unknownFetchError);
        }
    }
}

/**
 * This function return all the users in the database
 * 
 * @returns {Promise<any>} - A promise that resolves to an array of all user data
 * @throws {Error} - Throws an error if there is an issue fetching the users
 */
export async function getAllUsers(): Promise<any> {
    try {
        const users = await User.findAll();
        return users;
    } catch (error) {
        if (error instanceof Error) {
            console.error(ErrorMessagesUserModel.fetchError, error.message);
            throw new Error(`${ErrorMessagesUserModel.fetchError} ${error.message}`);
        } else {
            console.error(ErrorMessagesUserModel.unknownFetchError, error);
            throw new Error(ErrorMessagesUserModel.unknownFetchError);
        }
    }
}
