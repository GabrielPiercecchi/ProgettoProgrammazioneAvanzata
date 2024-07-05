import { DBIsConnected } from "../database/database";
import { DataTypes, Sequelize } from 'sequelize';
import { Section } from '../models/sections';
import * as distanceCalculator from '../other/distanceCalculator';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

//Connection to DataBase
const sequelize: Sequelize = DBIsConnected.getInstance();

// CREATE Section
export async function createSection(initialGate: string, finalGate: string): Promise<any> {
    try {
        /*
        // Esempio di utilizzo
        const coordString1 = 'LAT43.6158299LON13.518915';
        const coordString2 = 'LAT44.494887LON11.3426163';
        
        const coord1 = parseCoordinateString(coordString1);
        const coord2 = parseCoordinateString(coordString2);
        
        console.log(`Distanza: ${haversineDistance(coord1, coord2)} km`);
        */

        const coord1 = distanceCalculator.parseCoordinateString(initialGate);
        const coord2 = distanceCalculator.parseCoordinateString(finalGate);
        const distance = distanceCalculator.haversineDistance(coord1, coord2);
        // Creare la nuova sezione
        const newSection = await Section.create({
            initialGate,
            finalGate,
            distance
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

/**
 * UPDATE Section
 * @param InitialGate value for initialGate
 * @param FinalGate value for finalGate
 * @param newInitialGate New value for initialGate
 * @param newFinalGate New value for finalGate
 * @returns Updated Section object
 */
export async function updateSection(initialGate: string, finalGate: string, newInitialGate: string, newFinalGate: string): Promise<any> {
    let result: any;
    try {
        // Trova la sezione basandosi sulla chiave primaria composta da initialGate e finalGate
        result = await Section.findOne({
            where: {
                initialGate: initialGate,
                finalGate: finalGate
            }
        });
        if (result) {
            // Aggiorna i campi initialGate e finalGate con i nuovi valori
            result.initialGate = newInitialGate;
            result.finalGate = newFinalGate;
            const coord1 = distanceCalculator.parseCoordinateString(result.initialGate);
            const coord2 = distanceCalculator.parseCoordinateString(result.finalGate);
            const distance = distanceCalculator.haversineDistance(coord1, coord2);
            result.distance = distance;
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

/**
 * DELETE Section
 * @param sectionId ID of the Section to delete
 * @returns Success message if deletion is successful
 */
export async function deleteSection(sectionId: number): Promise<string> {
    try {
        // Find the Section based on its primary key (ID)
        const result = await Section.findByPk(sectionId);

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

