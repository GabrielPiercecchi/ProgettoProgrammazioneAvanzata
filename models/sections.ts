import { DBIsConnected } from "../database/database";
import { DataTypes, Sequelize, Model, BuildOptions } from 'sequelize';
import { Gate } from './gates'; // Import the Gate model
// Import functions for coordinate parsing and distance calculation
import { parseCoordinateString, haversineDistance } from '../other/distanceCalculator';

// Connection to DataBase
const sequelize: Sequelize = DBIsConnected.getInstance();

/**
 * Model 'Section'
 *
 * Define the model 'Section' to interface with the "sections" table
 */
export const Section = sequelize.define('sections', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    initialGate: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: Gate,
            key: 'location'
        }
    },
    finalGate: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: Gate,
            key: 'location'
        }
    },
    distance: {
        type: DataTypes.FLOAT,
        allowNull: false
    }
}, {
    modelName: 'sections',
    timestamps: false,
    indexes: [
        {
            unique: true,
            fields: ['initialGate', 'finalGate']
        }
    ],
    // hooks: {
    //     beforeCreate: async (section, options) => {
    //         // Fetch initialGate and finalGate coordinates from the database
    //         const initialGate = await Gate.findByPk((section as any).initialGate);
    //         const finalGate = await Gate.findByPk((section as any).finalGate);

    //         if (initialGate && finalGate) {
    //             const initialGateCoords = initialGate.get('location'); // Assume location holds GPS coordinates
    //             const finalGateCoords = finalGate.get('location'); // Assume location holds GPS coordinates
                
    //             // Assicurati che initialGateCoords e finalGateCoords siano di tipo string
    //             if (typeof initialGateCoords === 'string' && typeof finalGateCoords === 'string') {
    //                 // Parse coordinates
    //                 const coord1 = parseCoordinateString(initialGateCoords);
    //                 const coord2 = parseCoordinateString(finalGateCoords);

    //                 // Calculate distance using haversine formula
    //                 (section as any).distance = haversineDistance(coord1, coord2);
    //             } else {
    //                 console.error('initialGateCoords o finalGateCoords are not Type String');
    //             }
    //         } else {
    //             throw new Error('Initial Gate or Final Gate not found.');
    //         }
    //     },
    //     beforeUpdate: async (section, options) => {
    //         // Fetch initialGate and finalGate coordinates from the database
    //         const initialGate = await Gate.findByPk((section as any).initialGate);
    //         const finalGate = await Gate.findByPk((section as any).finalGate);

    //         if (initialGate && finalGate) {
    //             const initialGateCoords = initialGate.get('location'); // Assume location holds GPS coordinates
    //             const finalGateCoords = finalGate.get('location'); // Assume location holds GPS coordinates
                
    //             // Assicurati che initialGateCoords e finalGateCoords siano di tipo string
    //             if (typeof initialGateCoords === 'string' && typeof finalGateCoords === 'string') {
    //                 // Parse coordinates
    //                 const coord1 = parseCoordinateString(initialGateCoords);
    //                 const coord2 = parseCoordinateString(finalGateCoords);

    //                 // Calculate distance using haversine formula
    //                 (section as any).distance = haversineDistance(coord1, coord2);
    //             } else {
    //                 console.error('initialGateCoords o finalGateCoords are not Type String');
    //             }
    //         } else {
    //             throw new Error('Initial Gate or Final Gate not found.');
    //         }
    //     }
    // }
});

// Verify if the Section is in the database
//GET
export async function getSections(initialGate: string, finalGate: string): Promise<any> {
    let result:any;
    try {
        // Use `findOne` with `where` for searching the Section with `initialGate` e `finalGate`
        result = await Section.findOne({
            where: {
                initialGate: initialGate,
                finalGate: finalGate
            },
            raw: true
        });
        return result;
    } catch (error) {
        console.error('Error during Section search in the database.:', error);
        throw new Error('Error during Section search in the database.');
    }
}

//GET ALL
export async function getAllSections(): Promise<any> {
    let result:any;
    try {
        result = await Section.findAll();
        return result;
    } catch (error) {
        console.error('Error fetching Section:', error);
        throw new Error('Error fetching Section.');
    }
}

// UPDATE
// async function updateSection(sectionId: { initialGate: string, finalGate: string }, newInitialGate: string, newFinalGate: string): Promise<any> {
//     let result: any;
//     try {
//         // Trova la sezione basandosi sulla chiave primaria composta da initialGate e finalGate
//         result = await Section.findOne({
//             where: {
//                 initialGate: sectionId.initialGate,
//                 finalGate: sectionId.finalGate
//             }
//         });
//         if (result) {
//             // Aggiorna i campi initialGate e finalGate con i nuovi valori
//             result.initialGate = newInitialGate;
//             result.finalGate = newFinalGate;
//             await result.save();
//             return result;
//         } else {
//             throw new Error('Section not found.');
//         }
//     } catch (error) {
//         console.error('Error during Section update in the database:', error);
//         throw new Error('Error during Section update in the database.');
//     }
// }

// // DELETE
// async function deleteSection(sectionId: { initialGate: string, finalGate: string }): Promise<any> {
//     let result: any;
//     try {
//         // Trova la sezione basandosi sulla chiave primaria composta da initialGate e finalGate
//         result = await Section.findOne({
//             where: {
//                 initialGate: sectionId.initialGate,
//                 finalGate: sectionId.finalGate
//             }
//         });
//         if (result) {
//             await result.destroy();
//             return `Section with ID ${sectionId} was deleted successfully.`;
//         } else {
//             throw new Error('Section not found.');
//         }
//     } catch (error) {
//         console.error('Error during Section deletion in the database:', error);
//         throw new Error('Error during Section deletion in the database.');
//     }
// }

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