import { DBIsConnected } from '../database/database';
import { DataTypes, Sequelize } from 'sequelize';
import { User } from './users';
import { ErrorMessagesGateModel } from '../messages/errorMessages';

// Connection to DataBase
const sequelize: Sequelize = DBIsConnected.getInstance();

/**
 * Model 'Gate'
 *
 * Define the model 'Gate' to interface with the "gates" table
 */
export const Gate = sequelize.define('gates', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    location: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        references: {
            model: User,
            key: 'username'
        },
        onUpdate: 'CASCADE', // Ensure username updates are cascaded to Gates table
    },
},
    {
        modelName: 'gates',
        timestamps: false,
    });

/**
 * This function returns a specific gate from the database based on the id provided as a parameter
 * 
 * @param {number} id - The id of the gate to fetch
 * @returns {Promise<any>} - A promise that resolves to the gate data or null if not found
 * @throws {Error} - Throws an error if there is an issue fetching the gate
 */
export async function getGates(id: number): Promise<any> {
    let result: any;
    try {
        result = await Gate.findByPk(id);

        return result;
    } catch (error) {
        if (error instanceof Error) {
            console.error(ErrorMessagesGateModel.fetchError, error.message);
            throw new Error(`${ErrorMessagesGateModel.fetchError} ${error.message}`);
        } else {
            console.error(ErrorMessagesGateModel.unknownFetchError, error);
            throw new Error(`${ErrorMessagesGateModel.unknownFetchError} ${error}`);
        }
    }
}

/**
 * This function returns all the instances of the Gate model from the database
 * 
 * @returns {Promise<any>} - A promise that resolves to an array of all gate data
 * @throws {Error} - Throws an error if there is an issue fetching the gates
 */
export async function getAllGates(): Promise<any> {
    try {
        const gates = await Gate.findAll();
        console.log(gates);
        return gates;
    } catch (error) {
        if (error instanceof Error) {
            console.error(ErrorMessagesGateModel.fetchError, error.message);
            throw new Error(`${ErrorMessagesGateModel.fetchError} ${error.message}`);
        } else {
            console.error(ErrorMessagesGateModel.unknownFetchError, error);
            throw new Error(`${ErrorMessagesGateModel.unknownFetchError} ${error}`);
        }
    }
}
