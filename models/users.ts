import { DBIsConnected } from "../database/database";
import { DataTypes, Sequelize } from 'sequelize';
import { ErrorMessagesUserModel } from '../errorMessages/errorMessages';

//Connection to DataBase
const sequelize: Sequelize = DBIsConnected.getInstance();

/**
 * model 'User'
 *
 * Define the model 'User' to interface with the "vehicles" table
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

// Verify if the Gate is in the database
//GET
export async function getUser(username: string): Promise<any> {
    let result: any;
    try {
        // Converti il parametro type in minuscolo per la ricerca
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

// GET ALL
export async function getAllUsers(): Promise<any> {
    try {
        const gates = await User.findAll();
        return gates;
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