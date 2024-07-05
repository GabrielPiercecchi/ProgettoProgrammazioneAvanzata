import { Vehicle } from '../models/vehicles';

// CREATE
export async function createVehicle(type: string, limit: number): Promise<any> {
    let result: any;
    try {
        result = await Vehicle.create({ type, limit });
        return result;
    } catch (error) {
        console.error('Error during Vehicle creation in the database:', error);
        throw new Error('Error during Vehicle creation in the database.');
    }
}

// UPDATE
export async function updateVehicle(type: string, newLimit: number): Promise<any> {
    let result: any;

    try {
        result = await Vehicle.findByPk(type);

        // pk can't be modified
        if (result) {
            result.limit = newLimit;
            await result.save();
            return result;
        } else {
            throw new Error('Vehicle not found.');
        }
    } catch (error) {
        console.error('Error during Vehicle update in the database:', error);
        throw new Error('Error during Vehicle update in the database.');
    }
}

// DELETE
export async function deleteVehicle(type: string): Promise<any> {
    let result: any;
    try {
        result = await Vehicle.destroy({ where: { type } });
        if (result) {
            return `Vehicle with type ${type} was deleted successfully.`;
        } else {
            throw new Error('Vehicle not found.');
        }
    } catch (error) {
        console.error('Error during Vehicle deletion in the database:', error);
        throw new Error('Error during Vehicle deletion in the database.');
    }
}
