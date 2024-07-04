import {DBIsConnected} from "../database/database";
import {DataTypes, Sequelize} from 'sequelize';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

//Connection to DataBase
const sequelize: Sequelize = DBIsConnected.getInstance();

/**
 * model 'Gate'
 *
 * Define the model 'Gate' to interface with the "gates" table
 */
export const Gate = sequelize.define('gates', {
    location: {
        type: DataTypes.STRING,
        primaryKey: true,},
    username: {
        type: DataTypes.STRING,
        unique: true, 
        allowNull: false,},
    password: {
        type: DataTypes.STRING, 
        allowNull: false},
},
{
    modelName: 'gates',
    timestamps: false,
    // hooks: {
    //     beforeCreate: async (gate, options) => {
    //         if ((gate as any).changed('password')) {
    //             (gate as any).password = await bcrypt.hash((gate as any).password, SALT_ROUNDS);
    //         }
    //     },
    //     beforeUpdate: async (gate, options) => {
    //         if ((gate as any).changed('password')) {
    //             (gate as any).password = await bcrypt.hash((gate as any).password, SALT_ROUNDS);
    //         }
    //     }
    // }
});

// Verify if the Gate is in the database
//GET
export async function checkIfGateExists(username: string): Promise<any> {
    let result:any;
    try {
        result = await Gate.findByPk(username, {raw: true});

        return result;
    } catch (error) {
        console.error('Error during Gate search in the database.:', error);
        throw new Error('Error during Gate search in the database.');
    }
}

// GET ALL
export async function getAllGates(): Promise<any> {
    try {
        const gates = await Gate.findAll();
        console.log('Gates:');
        console.log(gates);
        return gates;
    } catch (error) {
        console.error('Error fetching gates:', error);
        throw new Error('Error fetching gates.');
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

// async function syncDatabase() {
//     try {
//       await Gate.sync(); // { force: true } ricrea la tabella, cancellando la precedente se esiste
//       console.log('Database synchronized');
//     } catch (error) {
//       console.error('Error synchronizing the database:', error);
//     }
//   }
  
//   syncDatabase();