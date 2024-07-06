import { Transit } from '../models/transits';

// CREATE 
export const createTransit = async (plate: string, speed: number, weather: string, vehicles_types: string, gate: string ): Promise<void> => {
    let result: any;
    try {
        const transit_date = new Date();
        result = await Transit.create({ plate, transit_date, speed, weather, vehicles_types, gate });
        return result;
        
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error during Transit creation in the database:', error.message);
            throw new Error(`Error during Transit creation in the database: ${error.message}`);
        } else {
            console.error('Unknown error during Transit creation in the database:', error);
            throw new Error('Unknown error during Transit creation in the database.');
        }
    }
} 

// Update 

export async function updateTransit( transitId: number, newPlate: string, newSpeed: number, newWeather: string, newVehicles_types: string, newGate: string ): Promise<any> {
    let result: any;
    try {
        result = await Transit.findByPk(transitId);
        if (result) {
            // we should check if we respect the constraints
            result.plate = newPlate;
            result.transit_date = new Date();
            result.speed = newSpeed;
            result.weather = newWeather;
            result.vehicles_types = newVehicles_types;
            result.gate = newGate;
            //result.used = newUsed;

            await result.save();
            return result;
        } else {
            throw new Error('Transit not found.');
        }
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error during Transit update in the database:', error.message);
            throw new Error(`Error during Transit update in the database: ${error.message}`);
        } else {
            console.error('Unknown error during Transit update in the database:', error);
            throw new Error('Unknown error during Transit update in the database.');
        }
    }
}

// Delete 

export async function deleteTransit( transitId: number ): Promise<any> {
    try {
        const result = await Transit.findByPk(transitId);
        if (result) {
            await result.destroy();
            return `Transit with ID ${transitId} was deleted successfully.`;
        } else {
            throw new Error('Transit not found.');
        }
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error during Transit deletion in the database:', error.message);
            throw new Error(`Error during Transit deletion in the database: ${error.message}`);
        } else {
            console.error('Unknown error during Transit deletion in the database:', error);
            throw new Error('Unknown error during Transit deletion in the database.');
        }
    }
}