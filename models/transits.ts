import { DBIsConnected } from "../database/database";
import { DataTypes, Sequelize, Model } from 'sequelize';
import { Vehicle } from './vehicles'; // Import the Vehicle model
import { Gate } from './gates'; // Import the Gates model

const sequelize: Sequelize = DBIsConnected.getInstance();

export const Transit = sequelize.define('transits', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    plate: {
        type: DataTypes.STRING,
        allowNull: false,
        //primaryKey: true
    },
    transit_date: {
        type: DataTypes.DATE,
        allowNull: false,
        //primaryKey: true
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
    indexes: [
        {
            unique: true,
            fields: ['plate', 'transit_date']
        }
    ],
    // hooks: {
    //     beforeCreate: async (transit, options) => {
    //         const vehicle = await Vehicle.findOne({ where: { type: transit.vehicles_types } });
    //         if (!vehicle) {
    //             throw new Error(`Vehicle type ${transit.vehicles_types} does not exist`);
    //         }
    //     }
    // }
});

// GET ALL
export async function getAllTransits(): Promise<any[]> {
    let result: any;
    try {
        result = await Transit.findAll();
        return result;
    } catch (error) {
        console.error('Error retrieving transits:', error);
        throw error;
    }
}

// Method to get a transit by plate and transit_date
export async function getTransit(transitId: number): Promise<any> {
    let result:any;
    try {
        // Use `findOne` with `where` for searching the Section with `initialGate` e `finalGate`
        result = await Transit.findByPk(transitId, { raw: true });
        return result;
    } catch (error) {
        console.error('Error during Transit search in the database.:', error);
        throw new Error('Error during Transit search in the database.');
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