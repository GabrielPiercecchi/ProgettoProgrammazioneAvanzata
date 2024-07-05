import { Transit } from '../models/transits';

// CREATE
export const createTransit = async (plate: String, transit_date: Date, speed: Number, weather: String, vehicles_types: String, gate: String, used: Boolean ): Promise<void> => {
    let result: any;
    try {
        result = await Transit.create({ plate, transit_date, speed, weather, vehicles_types, gate });
        return result;
        
    } catch (error) {
        console.error('Error during Transit creation in the database:', error);
        throw new Error('Error during Transit creation in the database.');
    }
}