import { DBIsConnected } from "../database/database";
import { DataTypes, Sequelize, where } from 'sequelize';
import { User } from './users';

//Connection to DataBase
const sequelize: Sequelize = DBIsConnected.getInstance();

/**
 * model 'Gate'
 *
 * Define the model 'Gate' to interface with the "gates" table
 */
export const Gate = sequelize.define('gates', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    location: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: User,
            key: 'username'
        },
        onUpdate: 'CASCADE', // Ensure username updates are cascaded to Gates table
    },
},
    {
        modelName: 'gates',
        timestamps: false,
    });

// Verify if the Gate is in the database
//GET
export async function getGates(id: number): Promise<any> {
    let result: any;
    try {
        // Converti il parametro type in minuscolo per la ricerca
        result = await Gate.findByPk(id);

        return result;
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error during Gate creation in the database:', error.message);
            throw new Error(`Error during Gate creation in the database: ${error.message}`);
        } else {
            console.error('Unknown error during Gate creation in the database:', error);
            throw new Error('Unknown error during Gate creation in the database.');
        }
    }
}

// GET ALL
export async function getAllGates(): Promise<any> {
    try {
        const gates = await Gate.findAll();
        console.log(gates)
        return gates;
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error during Gate fetch in the database:', error.message);
            throw new Error(`Error during Gate fetch in the database: ${error.message}`);
        } else {
            console.error('Unknown error during Gate fetch in the database:', error);
            throw new Error('Unknown error during Gate fetch in the database.');
        }
    }
}