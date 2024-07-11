import { DBIsConnected } from "../database/database";
import { DataTypes, Sequelize } from 'sequelize';
import { Gate } from './gates'; // Import the Gate model
import { ErrorMessagesSectionModel } from "../messages/errorMessages";

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
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Gate,
            key: 'id'
        },
    },
    finalGate: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Gate,
            key: 'id'
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

/**
 * Function to retrieve a Section by ID
 * @param sectionId - The ID of the section to retrieve
 * @returns The section data or null if not found
 */
export async function getSections(sectionId: number): Promise<any> {
    let result: any;
    try {
        // Use `findByPk` to search for the Section by its primary key
        result = await Section.findByPk(sectionId, { raw: true });
        return result;
    } catch (error) {
        if (error instanceof Error) {
            console.error(ErrorMessagesSectionModel.fetchError, error.message);
            throw new Error(`${ErrorMessagesSectionModel.fetchError} ${error.message}`);
        } else {
            console.error(ErrorMessagesSectionModel.unknownFetchError, error);
            throw new Error(`${ErrorMessagesSectionModel.unknownFetchError} ${error}`);
        }
    }
}

/**
 * Function to retrieve all Sections
 * @returns A list of all sections
 */
export async function getAllSections(): Promise<any> {
    let result: any;
    try {
        result = await Section.findAll();
        return result;
    } catch (error) {
        if (error instanceof Error) {
            console.error(ErrorMessagesSectionModel.fetchError, error.message);
            throw new Error(`${ErrorMessagesSectionModel.fetchError} ${error.message}`);
        } else {
            console.error(ErrorMessagesSectionModel.unknownFetchError, error);
            throw new Error(`${ErrorMessagesSectionModel.unknownFetchError} ${error}`);
        }
    }
}
