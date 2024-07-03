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
    hooks: {
        beforeCreate: async (gate, options) => {
            if ((gate as any).changed('password')) {
                (gate as any).password = await bcrypt.hash((gate as any).password, SALT_ROUNDS);
            }
        },
        beforeUpdate: async (gate, options) => {
            if ((gate as any).changed('password')) {
                (gate as any).password = await bcrypt.hash((gate as any).password, SALT_ROUNDS);
            }
        }
    }
});

// Verify if the Gate is in the database
//GET
async function checkIfGateExists(username: string): Promise<any> {
    let result:any;
    try {
        result = await Gate.findByPk(username, {raw: true});

        return result;
    } catch (error) {
        console.error('Error during Gate search in the database.:', error);
        throw new Error('Error during Gate search in the database.');
    }
}

// UPDATE
async function updateGates(location: string, newUsername: string, newPassword: string): Promise<any> {
    let result:any;
    try {
        result = await Gate.findByPk(location);
        if (result) {
            result.username = newUsername;
            result.password = newPassword;
            await result.save();
            return result;
        } else {
            throw new Error('Gate not found.');
        }
    } catch (error) {
        console.error('Error during Gate update in the database:', error);
        throw new Error('Error during Gate update in the database.');
    }
}

// DELETE
async function deleteGate(username: string): Promise<any> {
    let result:any;
    try {
        result = await Gate.destroy({ where: { type: username } });
        if (result) {
            return `Gate with username ${username} was deleted successfully.`;
        } else {
            throw new Error('Gate not found.');
        }
    } catch (error) {
        console.error('Error during Gate deletion in the database:', error);
        throw new Error('Error during Gate deletion in the database.');
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