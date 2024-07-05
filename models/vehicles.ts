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
        console.error('Error during Vehicle search in the database.:', error);
        throw new Error('Error during Vehicles search in the database.');
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
        console.error('Error fetching vehicles:', error);
        throw new Error('Error fetching vehicles.');
    }
};


// // UPDATE
// async function updateVehicle(type: string, newLimit: number): Promise<any> {
//     let result:any;
//     try {
//         result = await Vehicle.findByPk(type);
//         if (result) {
//             result.limit = newLimit;
//             await result.save();
//             return result;
//         } else {
//             throw new Error('Vehicle not found.');
//         }
//     } catch (error) {
//         console.error('Error during Vehicle update in the database:', error);
//         throw new Error('Error during Vehicle update in the database.');
//     }
// }

// // DELETE
// async function deleteVehicle(type: string): Promise<any> {
//     let result:any;
//     try {
//         result = await Vehicle.destroy({ where: { type: type } });
//         if (result) {
//             return `Vehicle with type ${type} was deleted successfully.`;
//         } else {
//             throw new Error('Vehicle not found.');
//         }
//     } catch (error) {
//         console.error('Error during Vehicle deletion in the database:', error);
//         throw new Error('Error during Vehicle deletion in the database.');
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

// async function syncDatabase() {
//     try {
//       await Vehicle.sync(); // { force: true } ricrea la tabella, cancellando la precedente se esiste
//       console.log('Database synchronized');
//     } catch (error) {
//       console.error('Error synchronizing the database:', error);
//     }
//   }
  
//   syncDatabase();