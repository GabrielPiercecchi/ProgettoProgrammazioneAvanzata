import {DBIsConnected} from "../database/database";
import {DataTypes, Sequelize} from 'sequelize';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

//Connection to DataBase
const sequelize: Sequelize = DBIsConnected.getInstance();

/**
 * model 'Gate'
 *
 * Define the model 'Gate' to interface with the "gates" table
 */
export const Gate = sequelize.define('gates', {
    location: {
        type: DataTypes.STRING,
        primaryKey: true,},
    username: {
        type: DataTypes.STRING,
        unique: true, 
        allowNull: false,},
    password: {
        type: DataTypes.STRING, 
        allowNull: false},
},
{
    modelName: 'gates',
    timestamps: false,
});

// Verify if the Gate is in the database
//GET
export async function getGates(username: string): Promise<any> {
    let result: any;
    try {
        // Converti il parametro type in minuscolo per la ricerca
        const usernameLowerCase = username.toLowerCase();
        result = await Gate.findOne({
            where: sequelize.where(
                sequelize.fn('lower', sequelize.col('username')), 
                usernameLowerCase
            ),
            raw: true
        });

        return result;
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error during Gate creation in the database:', error.message);
            throw new Error(`Error during Gate creation in the database: ${error.message}`);
        } else {
            console.error('Unknown error during Gate creation in the database:', error);
            throw new Error('Unknown error during Gate creation in the database.');
        }
    }
}

// GET ALL
export async function getAllGates(): Promise<any> {
    try {
        const gates = await Gate.findAll();
        return gates;
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error during Gate fetch in the database:', error.message);
            throw new Error(`Error during Gate fetch in the database: ${error.message}`);
        } else {
            console.error('Unknown error during Gate fetch in the database:', error);
            throw new Error('Unknown error during Gate fetch in the database.');
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