import { Op } from 'sequelize';
import { Vehicle, getAllVehicles, getVehicles } from '../models/vehicles';

// CREATE
export async function createVehicle(type: string, limit: number): Promise<any> {
    let result: any;
    try {
        // Controllo se esiste già un veicolo con lo stesso type (case-insensitive)
        const existingVehicle = await Vehicle.findOne({
            where: {
                [Op.or]: [
                    { type: type.toLowerCase() },
                    { type: type.charAt(0).toUpperCase() + type.slice(1).toLowerCase() }
                ]
            }
        });

        if (existingVehicle) {
            throw new Error('Vehicle with this type already exists.');
        }

        // Se non esiste, crea il nuovo veicolo
        result = await Vehicle.create({ type, limit });
        return result;
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error during Vehicle creation in the database:', error.message);
            throw new Error(`Error during Vehicle creation in the database: ${error.message}`);
        } else {
            console.error('Unknown error during Vehicle creation in the database:', error);
            throw new Error('Unknown error during Vehicle creation in the database.');
        }
    }
}

// UPDATE
export async function updateVehicle(type: string, newLimit: number): Promise<any> {
    let result: any;

    try {
        // Trova il veicolo con type case-insensitive
        result = await Vehicle.findOne({
            where: {
                [Op.or]: [
                    { type: type.toLowerCase() },
                    { type: type.charAt(0).toUpperCase() + type.slice(1).toLowerCase() }
                ]
            }
        });

        // pk can't be modified
        if (result) {
            result.limit = newLimit;
            await result.save();
            return result;
        } else {
            throw new Error('Vehicle not found.');
        }
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error during Vehicle update in the database:', error.message);
            throw new Error(`Error during Vehicle update in the database: ${error.message}`);
        } else {
            console.error('Unknown error during Vehicle update in the database:', error);
            throw new Error('Unknown error during Vehicle update in the database.');
        }
    }
}

// DELETE
export async function deleteVehicle(type: string): Promise<any> {
    let result: any;
    try {
        // Trova il veicolo con type case-insensitive
        result = await Vehicle.findOne({
            where: {
                [Op.or]: [
                    { type: type.toLowerCase() },
                    { type: type.charAt(0).toUpperCase() + type.slice(1).toLowerCase() }
                ]
            }
        });
        if (result) {
            await result.destroy();
            return `Vehicle with type ${type} was deleted successfully.`;
        } else {
            throw new Error('Vehicle not found.');
        }
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error during Vehicle deletion in the database:', error.message);
            throw new Error(`Error during Vehicle deletion in the database: ${error.message}`);
        } else {
            console.error('Unknown error during Vehicle deletion in the database:', error);
            throw new Error('Unknown error during Vehicle deletion in the database.');
        }
    }
}

export async function returnAllVehicles (req: any, res: any): Promise<any> {
    try {
        const vehicles = await getAllVehicles();
        res.status(200).json(vehicles);
      } catch (error) {
        if (error instanceof Error) {
          res.status(500).json({ error: error.message });
        } else {
          res.status(500).json({ error: "Si è verificato un errore sconosciuto." });
        }
      }
}

export async function returnVehicle(req: any, res: any, type: string): Promise<any> {
    try {
        const vehicle = await getVehicles(type);
        if (vehicle) {
          res.status(200).json(vehicle);
        } else {
          res.status(404).json({ error: 'Vehicle not found.' });
        }
      } catch (error) {
        if (error instanceof Error) {
          res.status(500).json({ error: error.message });
        } else {
          res.status(500).json({ error: "Si è verificato un errore sconosciuto." });
        }
      }
}

export async function returnCreateVehicle(req: any, res: any, type: string, limit: number) {
    try {
        const newVehicle = await createVehicle(type, limit);
        res.status(201).json(newVehicle);
      } catch (error) {
        if (error instanceof Error) {
          res.status(500).json({ error: error.message });
        } else {
          res.status(500).json({ error: "Si è verificato un errore sconosciuto." });
        }
      }
}

export async function returnUpdateVehicle(req: any, res: any, type: string, newLimit: number) {
    try {
        const updatedVehicle = await updateVehicle(type, newLimit);
        res.status(201).json(updatedVehicle);
      } catch (error) {
        if (error instanceof Error) {
          res.status(500).json({ error: error.message });
        } else {
          res.status(500).json({ error: "Si è verificato un errore sconosciuto." });
        }
      }
}

export async function returnDeleteVehicle(req: any, res: any, type: string) {
    try {
        const deletedVehicle = await deleteVehicle(type);
        res.status(200).json(deletedVehicle);
      } catch (error) {
        if (error instanceof Error) {
          res.status(500).json({ error: error.message });
        } else {
          res.status(500).json({ error: "Si è verificato un errore sconosciuto." });
        }
      }
}