import { DBIsConnected } from "../database/database";
import { DataTypes, Sequelize } from 'sequelize';
import { Op } from 'sequelize';
import { Gate } from '../models/gates';
import { User } from "../models/users";

//Connection to DataBase
const sequelize: Sequelize = DBIsConnected.getInstance();

// CREATE
export async function createGateUser(username: string): Promise<any> {
    try {

        // Creare il nuovo utente con ruolo gate
        const newUser = await User.create({
            username,
            role: "gate",
        });
        return newUser;
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error during User creation in the database:', error.message);
            throw new Error(`Error during User creation in the database: ${error.message}`);
        } else {
            console.error('Unknown error during User creation in the database:', error);
            throw new Error('Unknown error during User creation in the database.');
        }
    }
}

// DELETE
export async function deleteGateUser(username: string): Promise<any> {
    let result: any;
    try {
        result = await User.findByPk(username);
        if (result) {
            if (result.role != 'gate') {
                throw new Error('The user is not a gate. You can delete only gates.');
            }
            await result.destroy();
            return `Gate User with username ${username} was deleted successfully.`;
        } else {
            throw new Error('User not found.');
        }
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error during User deletion in the database:', error.message);
            throw new Error(`Error during User deletion in the database: ${error.message}`);
        } else {
            console.error('Unknown error during User deletion in the database:', error);
            throw new Error('Unknown error during User deletion in the database.');
        }
    }
}

// UPDATE
export async function updateGateUser(username: string, newUsername: string): Promise<any> {
    let user: any;
    try {
        // Trova l'utente nella tabella 'users'
        user = await User.findOne({ where: { username } });

        if (!user) {
            return null;
        }

        // Aggiorna l'username nella tabella 'users'
        await User.update(
            { username: newUsername },
            { where: { username } }
        );

        // Aggiorna l'username nella tabella 'gates'
        await Gate.update(
            { username: newUsername },
            { where: { username } }
        );

        // Ritorna l'utente aggiornato
        return await User.findOne({ where: { username: newUsername } });
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error during User updating in the database:', error.message);
            throw new Error(`Error during User updating in the database: ${error.message}`);
        } else {
            console.error('Unknown error during User updating in the database:', error);
            throw new Error('Unknown error during User updating in the database.');
        }
    }
}


