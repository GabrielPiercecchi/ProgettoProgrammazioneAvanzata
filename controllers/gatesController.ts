import { DBIsConnected } from "../database/database";
import { DataTypes, Sequelize } from 'sequelize';
import { Op } from 'sequelize';
import { Gate } from '../models/gates';
import { User } from "../models/users";

//Connection to DataBase
const sequelize: Sequelize = DBIsConnected.getInstance();

// CREATE
export async function createGate(location: string, username: string): Promise<any> {
    try {

        // Creare il nuovo utente con ruolo gate
        const newUser = await User.create({
            username,
            role: 'gate',
        });
        // Creare il nuovo gate
        const newGate = await Gate.create({
            location,
            username,
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
export async function updateGate(location: string, newUsername: string): Promise<any> {
    let result: any;
    try {
        result = await Gate.findByPk(location);
        if (result) {
            result.username = newUsername;// Hash della nuova password
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
export async function deleteGate(location: string): Promise<any> {
    let result: any;
    try {
        result = await Gate.findByPk(location);
        if (result) {
            // Cancella il gate
            await result.destroy();
            return `Gate with location ${location} was deleted successfully.`;
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
