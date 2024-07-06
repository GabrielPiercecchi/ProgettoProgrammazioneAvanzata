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
});

// GET ALL
export async function getAllTransits(): Promise<any[]> {
    let result: any;
    try {
        result = await Transit.findAll();
        return result;
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error during Transits fetch in the database:', error.message);
            throw new Error(`Error during Transits fetch in the database: ${error.message}`);
        } else {
            console.error('Unknown error Transits Gate fetch in the database:', error);
            throw new Error('Unknown error Transits Gate fetch in the database.');
        }
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
        if (error instanceof Error) {
            console.error('Error during Transit fetch in the database:', error.message);
            throw new Error(`Error during Transit fetch in the database: ${error.message}`);
        } else {
            console.error('Unknown error during Transit fetch in the database:', error);
            throw new Error('Unknown error during Transit fetch in the database.');
        }
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