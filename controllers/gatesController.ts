import {DBIsConnected} from "../database/database";
import {DataTypes, Sequelize} from 'sequelize';
import { Gate } from '../models/gates';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

//Connection to DataBase
const sequelize: Sequelize = DBIsConnected.getInstance();

// CREATE
export async function createGate(location: string, username: string, password: string): Promise<any> {
    try {
        // Creare il nuovo gate
        const newGate = await Gate.create({
            location,
            username,
            password: await bcrypt.hash(password, SALT_ROUNDS)  // Hash della password
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
            result.password = await bcrypt.hash(newPassword, SALT_ROUNDS);
            await result.save();
            return result;
        } else {
            throw new Error('Gate not found.');
        }
    } catch (error) {
        console.error('Error during Gate update in the database:', error);
        throw new Error('Error during Gate update in the database.');
    }
}

// DELETE
export async function deleteGate(username: string): Promise<any> {
    let result: any;
    try {
        result = await Gate.destroy({ where: { username } });
        if (result) {
            return `Gate with username ${username} was deleted successfully.`;
        } else {
            throw new Error('Gate not found.');
        }
    } catch (error) {
        console.error('Error during Gate deletion in the database:', error);
        throw new Error('Error during Gate deletion in the database.');
    }
}
