import { DBIsConnected } from "../database/database";
import { DataTypes, Sequelize } from 'sequelize';
import { ErrorMessagesVehicleModel } from "../messages/errorMessages";

// Connection to the database
const sequelize: Sequelize = DBIsConnected.getInstance();

/**
 * Model 'Vehicle'
 *
 * Defines the model 'Vehicle' to interface with the "vehicles" table
 */
export const Vehicle = sequelize.define('vehicles', {
    type: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    limit: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    modelName: 'vehicles',
    timestamps: false,
});

/**
 * This function returns a specific vehicle from the database based on the type provided as a parameter
 * 
 * @param {string} type - The type of the vehicle to fetch
 * @returns {Promise<any>} - A promise that resolves to the vehicle data or null if not found
 * @throws {Error} - Throws an error if there is an issue fetching the vehicle
 */
export async function getVehicles(type: string): Promise<any> {
    let vehicle: any;
    try {
        // Convert the parameter to lowercase for the search
        const typeLowerCase = type.toLowerCase();
        vehicle = await Vehicle.findOne({
            where: sequelize.where(
                sequelize.fn('lower', sequelize.col('type')),
                typeLowerCase
            ),
            raw: true
        });
        console.log('Vehicle:');
        console.log(vehicle);
        return vehicle;
    } catch (error) {
        if (error instanceof Error) {
            console.error(ErrorMessagesVehicleModel.fetchError, error.message);
            throw new Error(`${ErrorMessagesVehicleModel.fetchError} ${error.message}`);
        } else {
            console.error(ErrorMessagesVehicleModel.unknownFetchError, error);
            throw new Error(`${ErrorMessagesVehicleModel.unknownFetchError}`);
        }
    }
}

/**
 * This function returns all the instances of the Vehicle model from the database
 * 
 * @returns {Promise<any>} - A promise that resolves to an array of all vehicle data
 * @throws {Error} - Throws an error if there is an issue fetching the vehicles
 */
export async function getAllVehicles(): Promise<any> {
    try {
        const vehicles = await Vehicle.findAll();
        console.log('Vehicles:');
        console.log(vehicles);
        return vehicles;
    } catch (error) {
        if (error instanceof Error) {
            console.error(ErrorMessagesVehicleModel.fetchError, error.message);
            throw new Error(`${ErrorMessagesVehicleModel.fetchError} ${error.message}`);
        } else {
            console.error(ErrorMessagesVehicleModel.unknownFetchError, error);
            throw new Error(`${ErrorMessagesVehicleModel.unknownFetchError}`);
        }
    }
}
