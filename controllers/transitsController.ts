import { Transit } from '../models/transits';

// CREATE 
export const createTransit = async (plate: string, transit_date: Date, speed: number, weather: string, vehicles_types: string, gate: string, used: boolean ): Promise<void> => {
    let result: any;
    try {
        result = await Transit.create({ plate, transit_date, speed, weather, vehicles_types, gate, used });
        return result;
        
    } catch (error) {
        console.error('Error during Transit creation in the database:', error);
        throw new Error('Error during Transit creation in the database.');
    }
} 

// Update 

export async function updateTransit( transitId: number, newPlate: string, newDate: Date, newSpeed: number, newWeather: string, newVehicles_types: string, newGate: string, newUsed: boolean): Promise<any> {
    let result: any;
    try {
        result = await Transit.findByPk(transitId);
        if (result) {
            // we should check if we respect the constraints
            result.plate = newPlate;
            result.transit_date = newDate;
            result.speed = newSpeed;
            result.weather = newWeather;
            result.vehicles_types = newVehicles_types;
            result.gate = newGate;
            result.used = newUsed;

            await result.save();
            return result;
        } else {
            throw new Error('Transit not found.');
        }
    } catch (error) {
        console.error('Error during Transit update in the database:', error);
        throw new Error('Error during Transit update in the database.');
    }
}