import { DBIsConnected } from "../database/database";
import { DataTypes, Sequelize } from 'sequelize';
import { Vehicle } from './vehicles';
import { Gate } from './gates';
import { ErrorMessagesTransitModel } from "../messages/errorMessages";

/**
 * Get the Sequelize instance from the connected database.
 * 
 * @returns {Sequelize} The Sequelize instance connected to the database.
 */
const sequelize: Sequelize = DBIsConnected.getInstance();

/**
 * Define the Transit model using Sequelize.
 */
export const Transit = sequelize.define('transits', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    plate: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    transit_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    speed: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    weather: {
        type: DataTypes.ENUM('good weather', 'bad weather'),
        defaultValue: 'good weather',
        allowNull: false
    },
    vehicles_types: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: Vehicle,
            key: 'type'
        }
    },
    gate: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Gate,
            key: 'id'
        }
    },
    // Boolean value to indicate if the transit is used in the tickets database
    used: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    }
}, {
    modelName: 'transits',
    timestamps: false,
    indexes: [
        {
            unique: true,
            fields: ['plate', 'transit_date']
        }
    ],
});

/**
 * Retrieve all transits from the database.
 * 
 * @returns {Promise<any[]>} A promise that resolves to an array of transits.
 * @throws {Error} If an error occurs during the fetch operation.
 */
export async function getAllTransits(): Promise<any[]> {
    let result: any;
    try {
        result = await Transit.findAll();
        return result;
    } catch (error) {
        if (error instanceof Error) {
            console.error(ErrorMessagesTransitModel.fetchError, error.message);
            throw new Error(`${ErrorMessagesTransitModel.fetchError} ${error.message}`);
        } else {
            console.error(ErrorMessagesTransitModel.unknownFetchError, error);
            throw new Error(`${ErrorMessagesTransitModel.unknownFetchError} ${error}`);
        }
    }
}

/**
 * Retrieve all transits with plate 'notFound' from the database.
 * 
 * @returns {Promise<any[]>} A promise that resolves to an array of transits with plate 'notFound'.
 * @throws {Error} If no transits with plate 'notFound' are found or if an error occurs during the fetch operation.
 */
export async function getAllNotFoundTransits(): Promise<any[]> {
    try {
        const tickets = await Transit.findAll({ where: { plate: 'notFound' } });

        if (tickets.length === 0) {
            throw new Error(`${ErrorMessagesTransitModel.notFound}`);
        }

        return tickets;
    } catch (error) {
        if (error instanceof Error) {
            console.error(ErrorMessagesTransitModel.fetchError, error.message);
            throw new Error(`${ErrorMessagesTransitModel.fetchError} ${error.message}`);
        } else {
            console.error(ErrorMessagesTransitModel.unknownFetchError, error);
            throw new Error(`${ErrorMessagesTransitModel.unknownFetchError} ${error}`);
        }
    }
}

/**
 * Retrieve a transit by its ID from the database.
 * 
 * @param {number} transitId - The ID of the transit to retrieve.
 * @returns {Promise<any>} A promise that resolves to the retrieved transit object.
 * @throws {Error} If the transit with the specified ID is not found or if an error occurs during the fetch operation.
 */
export async function getTransit(transitId: number): Promise<any> {
    let result: any;
    try {
        result = await Transit.findByPk(transitId, { raw: true });
        return result;
    } catch (error) {
        if (error instanceof Error) {
            console.error(ErrorMessagesTransitModel.fetchError, error.message);
            throw new Error(`${ErrorMessagesTransitModel.fetchError} ${error.message}`);
        } else {
            console.error(ErrorMessagesTransitModel.unknownFetchError, error);
            throw new Error(`${ErrorMessagesTransitModel.unknownFetchError} ${error}`);
        }
    }
}
