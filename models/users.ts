import { DBIsConnected } from "../database/database";
import { DataTypes, Sequelize } from 'sequelize';

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
export async function getUsers(username: string): Promise<any> {
    let result: any;
    try {
        // Converti il parametro type in minuscolo per la ricerca
        result = await User.findByPk(username, { raw: true });

        return result;
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error during Users creation in the database:', error.message);
            throw new Error(`Error during Users creation in the database: ${error.message}`);
        } else {
            console.error('Unknown error during Users creation in the database:', error);
            throw new Error('Unknown error during Users creation in the database.');
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
            console.error('Error during Users fetch in the database:', error.message);
            throw new Error(`Error during Users fetch in the database: ${error.message}`);
        } else {
            console.error('Unknown error during Users fetch in the database:', error);
            throw new Error('Unknown error during Users fetch in the database.');
        }
    }
}

/**
 * Verifies if the request is made by an operator.
 * @param chargedata Body of the request containing operator details.
 * @returns Boolean indicating if the request is valid or a string error message.
 */
export async function TokenChargeVal(chargedata: any): Promise<boolean | string> {
    try {
        if (!chargedata.id_operator) {
            return 'User is not authorized to perform this operation.';
        }

        return true;
    } catch (error) {
        console.error('Error in TokenChargeVal function:', error);
        throw new Error('Error in TokenChargeVal function');
    }
}