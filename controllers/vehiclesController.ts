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
export async function updateVehicle(type: string, newType: string, newLimit: number): Promise<any> {
    let result: any;
    console.log(type);
    console.log(newType);
    console.log(newLimit);
    try {
        result = await Vehicle.findByPk(type);
        console.log(result);
        if (result) {
            if(result.type !== newType){
                result.type = newType;
                console.log(result);
            }
            if(result.limit !== newLimit){
                result.limit = newLimit;
                console.log(result);
            }
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
