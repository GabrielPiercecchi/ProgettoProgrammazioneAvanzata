import {DBIsConnected} from "../database/database";
import {DataTypes, Sequelize} from 'sequelize';
import { Section } from '../models/sections';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

//Connection to DataBase
const sequelize: Sequelize = DBIsConnected.getInstance();

// CREATE Section
export async function createSection(initialGate: string, finalGate: string): Promise<any> {
    try {
        // Creare la nuova sezione
        const newSection = await Section.create({
            initialGate,
            finalGate
        });
        return newSection;
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error during Section creation in the database:', error.message);
            throw new Error(`Error during Section creation in the database: ${error.message}`);
        } else {
            console.error('Unknown error during Section creation in the database:', error);
            throw new Error('Unknown error during Section creation in the database.');
        }
    }
}

// UPDATE Section
export async function updateSection(sectionId: { initialGate: string, finalGate: string }, newInitialGate: string, newFinalGate: string): Promise<any> {
    let result: any;
    try {
        // Trova la sezione basandosi sulla chiave primaria composta da initialGate e finalGate
        result = await Section.findOne({
            where: {
                initialGate: sectionId.initialGate,
                finalGate: sectionId.finalGate
            }
        });
        if (result) {
            // Aggiorna i campi initialGate e finalGate con i nuovi valori
            result.initialGate = newInitialGate;
            result.finalGate = newFinalGate;
            await result.save();
            return result;
        } else {
            throw new Error('Section not found.');
        }
    } catch (error) {
        console.error('Error during Section update in the database:', error);
        throw new Error('Error during Section update in the database.');
    }
}

// DELETE Section
export async function deleteSection(sectionId: { initialGate: string, finalGate: string }): Promise<any> {
    let result: any;
    try {
        // Trova la sezione basandosi sulla chiave primaria composta da initialGate e finalGate
        result = await Section.findOne({
            where: {
                initialGate: sectionId.initialGate,
                finalGate: sectionId.finalGate
            }
        });
        if (result) {
            await result.destroy();
            return `Section with ID ${sectionId} was deleted successfully.`;
        } else {
            throw new Error('Section not found.');
        }
    } catch (error) {
        console.error('Error during Section deletion in the database:', error);
        throw new Error('Error during Section deletion in the database.');
    }
}

