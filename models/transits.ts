import { DBIsConnected } from "../database/database";
import { DataTypes, Sequelize, Model } from 'sequelize';
import { Vehicle } from './vehicles'; // Import the Vehicle model
import { Gate } from './gates'; // Import the Gates model
import { type } from "os";

const sequelize: Sequelize = DBIsConnected.getInstance();

export const Transit = sequelize.define('transits', {
    plate: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    transit_date: {
        type: DataTypes.DATE,
        allowNull: false,
        primaryKey: true
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
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: Gate,
            key: 'location'
        }
    },
    // Boolean value to check if the transit is in use in the tickets Database
    used: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    }

}, {
    modelName: 'transits',
    timestamps: false,
    // hooks: {
    //     beforeCreate: async (transit, options) => {
    //         const vehicle = await Vehicle.findOne({ where: { type: transit.vehicles_types } });
    //         if (!vehicle) {
    //             throw new Error(`Vehicle type ${transit.vehicles_types} does not exist`);
    //         }
    //     }
    // }
});

// Method to get all transits
export async function getAllTransits(): Promise<any[]> {
    try {
        const transits = await Transit.findAll();
        const gates = await Gate.findAll();
        console.log('Transits:');
        console.log();
        return transits;
    } catch (error) {
        console.error('Error retrieving transits:', error);
        throw error;
    }
}

// Method to get a transit by plate and transit_date
export async function getTransit(plate: string, transit_date: Date): Promise<any> {
    try {
        // i dont need to check lower case because the plate is always uppercase
        const transit = await Transit.findOne({ 
            where: {
                plate,
                transit_date
            }
        });
        return transit;
    } catch (error) {
        console.error('Error retrieving transit:', error);
        throw error;
    }
}





// async function syncDatabase() {
//     try {
//         await Transit.sync(); // { force: true } ricrea la tabella, cancellando la precedente se esiste
//         console.log('Database synchronized');
//     } catch (error) {
//         console.error('Error synchronizing the database:', error);
//     }
// }

// syncDatabase();