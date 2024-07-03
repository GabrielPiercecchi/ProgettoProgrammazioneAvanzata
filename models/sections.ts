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
    initialGate: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true, // Part of the composite primary key
        references: {
            model: Gate,
            key: 'location'
        }
    },
    finalGate: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true, // Part of the composite primary key
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
    hooks: {
        beforeCreate: async (section, options) => {
            // Fetch initialGate and finalGate coordinates from the database
            const initialGate = await Gate.findByPk((section as any).initialGate);
            const finalGate = await Gate.findByPk((section as any).finalGate);

            if (initialGate && finalGate) {
                const initialGateCoords = initialGate.get('location'); // Assume location holds GPS coordinates
                const finalGateCoords = finalGate.get('location'); // Assume location holds GPS coordinates
                
                // Assicurati che initialGateCoords e finalGateCoords siano di tipo string
                if (typeof initialGateCoords === 'string' && typeof finalGateCoords === 'string') {
                    // Parse coordinates
                    const coord1 = parseCoordinateString(initialGateCoords);
                    const coord2 = parseCoordinateString(finalGateCoords);

                    // Calculate distance using haversine formula
                    (section as any).distance = haversineDistance(coord1, coord2);
                } else {
                    console.error('initialGateCoords o finalGateCoords non sono di tipo string');
                }
            } else {
                throw new Error('Initial Gate or Final Gate not found.');
            }
        }
    }
});