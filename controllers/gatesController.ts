import { DBIsConnected } from "../database/database";
import { DataTypes, Sequelize } from 'sequelize';
import { Op } from 'sequelize';
import { Gate } from '../models/gates';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

//Connection to DataBase
const sequelize: Sequelize = DBIsConnected.getInstance();

// CREATE
export async function createGate(location: string, username: string, password: string): Promise<any> {
    try {
        // Hash della password
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        // Creare il nuovo gate
        const newGate = await Gate.create({
            location,
            username,
            password: hashedPassword
        });
        return newGate;
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

// UPDATE
export async function updateGate(location: string, newUsername: string, newPassword: string): Promise<any> {
    let result: any;
    try {
        result = await Gate.findByPk(location);
        if (result) {
            result.username = newUsername;
            result.password = await bcrypt.hash(newPassword, SALT_ROUNDS); // Hash della nuova password
            await result.save();
            return result;
        } else {
            throw new Error('Gate not found.');
        }
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error during Gate updating in the database:', error.message);
            throw new Error(`Error during Gate updating in the database: ${error.message}`);
        } else {
            console.error('Unknown error during Gate updating in the database:', error);
            throw new Error('Unknown error during Gate updating in the database.');
        }
    }
}

// DELETE
export async function deleteGate(username: string): Promise<any> {
    let result: any;
    try {
        // Trova il gate con username case-insensitive
        result = await Gate.findOne({
            where: {
                [Op.or]: [
                    { username: username.toLowerCase() },
                    { username: username.charAt(0).toUpperCase() + username.slice(1).toLowerCase() }
                ]
            }
        });
        
        if (result) {
            // Cancella il gate
            await result.destroy();
            return `Gate with username ${username} was deleted successfully.`;
        } else {
            throw new Error('Gate not found.');
        }
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error during Gate deletion in the database:', error.message);
            throw new Error(`Error during Gate deletion in the database: ${error.message}`);
        } else {
            console.error('Unknown error during Gate deletion in the database:', error);
            throw new Error('Unknown error during Gate deletion in the database.');
        }
    }
}
