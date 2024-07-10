import { DBIsConnected } from "../database/database";
import { DataTypes, Sequelize } from 'sequelize';
import { Gate, getAllGates, getGates } from '../models/gates';
import { User } from "../models/users";
import { ErrorMessagesGateController } from "../errorMessages/errorMessages";

//Connection to DataBase
const sequelize: Sequelize = DBIsConnected.getInstance();

// CREATE
export async function createGate(location: string, username: string): Promise<any> {
    try {

        if (await User.findByPk(username) == null) {
            throw new Error('User does not exists in Users. You have to create it first');
        }
        // Creare il nuovo gate
        const newGate = await Gate.create({
            location,
            username,
        });
        return newGate;
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

// UPDATE
export async function updateGate(id: number, newUsername: string): Promise<any> {
    let result: any;
    let user: any;
    try {
        result = await Gate.findByPk(id);
        user = await User.findByPk(newUsername, { raw: true });
        console.log(user);
        if (!user) {
            throw new Error('User does not exists in Users. You have to create it first');
        }
        if (result) {
            result.username = newUsername;
            await result.save();
            return result;
        } else {
            throw new Error('Gate not found.');
        }
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error during Gate updating in the database:', error.message);
            throw new Error(`Error during Gate updating in the database: ${error.message}`);
        } else {
            console.error('Unknown error during Gate updating in the database:', error);
            throw new Error('Unknown error during Gate updating in the database.');
        }
    }
}

// DELETE
export async function deleteGate(id: number): Promise<any> {
    let result: any;
    try {
        result = await Gate.findByPk(id);
        if (result) {
            // Cancella il gate
            await result.destroy();
            return `Gate with location ${location} was deleted successfully.`;
        } else {
            throw new Error('Gate not found.');
        }
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error during Gate deletion in the database:', error.message);
            throw new Error(`Error during Gate deletion in the database: ${error.message}`);
        } else {
            console.error('Unknown error during Gate deletion in the database:', error);
            throw new Error('Unknown error during Gate deletion in the database.');
        }
    }
}

export async function returnAllGates(req: any, res: any): Promise<any> {
    try {
        const gates = await getAllGates();
        res.status(200).json(gates);
      } catch (error) {
        if (error instanceof Error) {
          res.status(500).json({ error: error.message });
        } else {
          res.status(500).json({ error: "Si è verificato un errore sconosciuto." });
        }
      }

}

export async function returnGate(req: any, res: any, id: number): Promise<any> {
    try {
        const gate = await getGates(id);
        if (gate) {
          res.status(200).json(gate);
        } else {
          res.status(404).json({ error: 'Gate not found' });
        }
      } catch (error) {
        if (error instanceof Error) {
          res.status(500).json({ error: error.message });
        } else {
          res.status(500).json({ error: "Si è verificato un errore sconosciuto." });
        }
      }
}

export async function returnCreateGate(req: any, res: any, location: string, username: string): Promise<any> {
    try {
        const newGate = await createGate(location, username);
        res.status(201).json(newGate);
      } catch (error) {
        if (error instanceof Error) {
          res.status(500).json({ error: error.message });
        } else {
          res.status(500).json({ error: "Si è verificato un errore sconosciuto." });
        }
      }
}

export async function returnUpdateGate(req: any, res: any, id: number, newUsername: string): Promise<any> {
    try {
        const updatedGate = await updateGate(id, newUsername);
        if (updatedGate) {
          res.status(200).json(updatedGate);
        } else {
          res.status(404).json({ error: 'Gate not found' });
        }
      } catch (error) {
        if (error instanceof Error) {
          res.status(500).json({ error: error.message });
        } else {
          res.status(500).json({ error: "Si è verificato un errore sconosciuto." });
        }
      }
}

export async function returnDeleteGate(req: any, res: any, id: number): Promise<any> {
    try {
        const gate = await deleteGate(id);
        if (gate) {
          res.status(200).json(gate);
        } else {
          res.status(404).json({ error: 'Gate not found' });
        }
      } catch (error) {
        if (error instanceof Error) {
          res.status(500).json({ error: error.message });
        } else {
          res.status(500).json({ error: "Si è verificato un errore sconosciuto." });
        }
      }
}