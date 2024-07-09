import {DBIsConnected} from "../database/database";
import {DataTypes, Sequelize} from 'sequelize';

//Connection to DataBase
const sequelize: Sequelize = DBIsConnected.getInstance();

/**
 * model 'Veichle'
 *
 * Define the model 'Veichle' to interface with the "vehicles" table
 */
export const Vehicle = sequelize.define('vehicles', {
    type: {
        type: DataTypes.STRING,
        primaryKey: true,},
    limit: {
        type: DataTypes.INTEGER, 
        allowNull: false},
},
{
    modelName: 'vehicles',
    timestamps: false
});

// Get a specific Vehicle
export async function getVehicles(type: string): Promise<any> {
    let vehicle: any;
    try {
        // Converti il parametro type in minuscolo per la ricerca
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
            console.error('Error during Vehicles fetch in the database:', error.message);
            throw new Error(`Error during Vehicles fetch in the database: ${error.message}`);
        } else {
            console.error('Unknown error during Vehicles fetch in the database:', error);
            throw new Error('Unknown error during Vehicles fetch in the database.');
        }
    }
};

// Get all the istances of the Vehicle
export async function getAllVehicles(): Promise<any> {
    try {
        const vehicles = await Vehicle.findAll();
        console.log('Vehicles:');
        console.log(vehicles);
        return vehicles;
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error during Vehicles fetch in the database:', error.message);
            throw new Error(`Error during Vehicles fetch in the database: ${error.message}`);
        } else {
            console.error('Unknown error during Vehicles fetch in the database:', error);
            throw new Error('Unknown error during Vehicles fetch in the database.');
        }
    }
};