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
        },
    },
    finalGate: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: Gate,
            key: 'location'
        },
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
});

// Verify if the Section is in the database
//GET
export async function getSections(sectionId: number): Promise<any> {
    let result: any;
    try {
        // Use `findOne` with `where` for searching the Section with `initialGate` e `finalGate`
        result = await Section.findByPk(sectionId, { raw: true });
        return result;
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error during Sections fetch in the database:', error.message);
            throw new Error(`Error during Sections fetch in the database: ${error.message}`);
        } else {
            console.error('Unknown error during Sections fetch in the database:', error);
            throw new Error('Unknown error during Sections fetch in the database.');
        }
    }
}

//GET ALL
export async function getAllSections(): Promise<any> {
    let result: any;
    try {
        result = await Section.findAll();
        return result;
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error during Sections fetch in the database:', error.message);
            throw new Error(`Error during Sections fetch in the database: ${error.message}`);
        } else {
            console.error('Unknown error Sections Gate fetch in the database:', error);
            throw new Error('Unknown error Sections Gate fetch in the database.');
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