import { DBIsConnected } from "../database/database";
import { DataTypes, Sequelize } from 'sequelize';
import { Gate, getAllGates, getGates } from '../models/gates';
import { User } from "../models/users";
import { ErrorMessagesGateController } from "../messages/errorMessages";
import { SuccessMessagesGateController } from "../messages/successMessages";

//Connection to DataBase
const sequelize: Sequelize = DBIsConnected.getInstance();

// CREATE
export async function createGate(location: string, username: string): Promise<any> {
    try {

        if (await User.findByPk(username) == null) {
          throw new Error(`${ErrorMessagesGateController.userNotFound} ${username}`);
        }
        // Creare il nuovo gate
        const newGate = await Gate.create({
            location,
            username,
        });
        return newGate;
    } catch (error) {
        if (error instanceof Error) {
            console.error(ErrorMessagesGateController.creationError, error.message);
            throw new Error(`${ErrorMessagesGateController.creationError} ${error.message}`);
        } else {
            console.error(ErrorMessagesGateController.unknownCreationError, error);
            throw new Error(`${ErrorMessagesGateController.unknownCreationError} ${error}`);
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
          throw new Error(`${ErrorMessagesGateController.userNotFound} ${newUsername}`);
        }
        if (result) {
            result.username = newUsername;
            await result.save();
            return result;
        } else {
          throw new Error(`${ErrorMessagesGateController.gateNotFound} ${id}`);
        }
    } catch (error) {
        if (error instanceof Error) {
            console.error(ErrorMessagesGateController.updatingError, error.message);
            throw new Error(`${ErrorMessagesGateController.updatingError} ${error.message}`);
        } else {
            console.error(ErrorMessagesGateController.unknownUpdatingError, error);
            throw new Error(`${ErrorMessagesGateController.unknownUpdatingError} ${error}`);
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
            return `${SuccessMessagesGateController.deleteSuccess} ${id}`;
        } else {
          throw new Error(`${ErrorMessagesGateController.gateNotFound} ${id}`);
        }
    } catch (error) {
        if (error instanceof Error) {
            console.error(ErrorMessagesGateController.deletionError, error.message);
            throw new Error(`${ErrorMessagesGateController.deletionError} ${error.message}`);
        } else {
            console.error(ErrorMessagesGateController.unknownDeletionError, error);
            throw new Error(`${ErrorMessagesGateController.unknownDeletionError} ${error}`);
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
          res.status(500).json({ error: ErrorMessagesGateController.unknownError });
        }
      }

}

export async function returnGate(req: any, res: any, id: number): Promise<any> {
    try {
        const gate = await getGates(id);
        if (gate) {
          res.status(200).json(gate);
        } else {
          res.status(404).json({ error: ErrorMessagesGateController.gateNotFound });
        }
      } catch (error) {
        if (error instanceof Error) {
          res.status(500).json({ error: error.message });
        } else {
          res.status(500).json({ error: ErrorMessagesGateController.unknownError });
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
          res.status(500).json({ error: ErrorMessagesGateController.unknownError });
        }
      }
}

export async function returnUpdateGate(req: any, res: any, id: number, newUsername: string): Promise<any> {
    try {
        const updatedGate = await updateGate(id, newUsername);
        if (updatedGate) {
          res.status(200).json(updatedGate);
        } else {
          res.status(404).json({ error: ErrorMessagesGateController.gateNotFound });
        }
      } catch (error) {
        if (error instanceof Error) {
          res.status(500).json({ error: error.message });
        } else {
          res.status(500).json({ error: ErrorMessagesGateController.unknownError });
        }
      }
}

export async function returnDeleteGate(req: any, res: any, id: number): Promise<any> {
    try {
        const gate = await deleteGate(id);
        if (gate) {
          res.status(200).json(gate);
        } else {
          res.status(404).json({ error: ErrorMessagesGateController.gateNotFound });
        }
      } catch (error) {
        if (error instanceof Error) {
          res.status(500).json({ error: error.message });
        } else {
          res.status(500).json({ error: ErrorMessagesGateController.unknownError });
        }
      }
}