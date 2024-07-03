import {DBIsConnected} from "../database/database";
import {DataTypes, Sequelize} from 'sequelize';

//Connection to DataBase
const sequelize: Sequelize = DBIsConnected.getInstance();

/**
 * model 'Veichle'
 *
 * Define the model 'User' to interface with the "vehicles" table
 */
export const Vehicle = sequelize.define('vehicles', {
    type: {type: DataTypes.STRING,  primaryKey: true, unique: true},
    limit: {type: DataTypes.INTEGER, allowNull: false},
},
{
    modelName: 'vehicles',
    timestamps: false,
    //freezeTableName: true
});

// Verify if the Vehicle is in the database
async function checkIfVehicleExists(type: string): Promise<any> {
    let result:any;
    try {
        result = await Vehicle.findByPk(type, {raw: true});

        return result;
    } catch (error) {
        console.error('Error during Vehicle search in the database.:', error);
        throw new Error('Error during Vehicles search in the database.');
    }
}


/**
 * Verifies if the request is made by an admin and if users exist.
 * @param chargedata Body of the request containing admin and destination user details.
 * @returns Boolean indicating if the request is valid or a string error message.
 */
export async function TokenChargeVal(chargedata: any): Promise<boolean | string> {
    try {
        if (!chargedata.username_admin || chargedata.username_admin.role !== "admin") {
            return 'User is not authorized to perform this operation.';
        }

        const admin = await checkIfUserExists(chargedata.username_admin.email);
        if (!admin) {
            return 'Admin user not found.';
        }

        const destinationUser = await checkIfUserExists(chargedata.destination_user);
        if (!destinationUser) {
            return 'Destination user not found.';
        }

        return true;
    } catch (error) {
        console.error('Error in TokenChargeVal function:', error);
        throw new Error('Error in TokenChargeVal function');
    }
}