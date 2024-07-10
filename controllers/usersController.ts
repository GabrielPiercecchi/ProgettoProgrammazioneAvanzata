import { DBIsConnected } from "../database/database";
import { Sequelize } from 'sequelize';
import { Gate } from '../models/gates';
import { User, getAllUsers, getUser } from "../models/users";
import { ErrorMessagesUserController } from "../errorMessages/errorMessages";
import { error } from "console";

// Connection to DataBase
const sequelize: Sequelize = DBIsConnected.getInstance();

// CREATE
export async function createGateUser(username: string): Promise<any> {
    try {
        // Creare il nuovo utente con ruolo gate
        const newUser = await User.create({
            username,
            role: "gate",
        });
        return newUser;
    } catch (error) {
        if (error instanceof Error) {
            console.error(ErrorMessagesUserController.createUser, error.message);
            throw new Error(`${ErrorMessagesUserController.createUser} ${error.message}`);
        } else {
            console.error(ErrorMessagesUserController.createUser, error);
            throw new Error(ErrorMessagesUserController.createUser);
        }
    }
}

// DELETE
export async function deleteGateUser(username: string): Promise<any> {
    let result: any;
    try {
        result = await User.findByPk(username);
        if (!result) {
            throw new Error(ErrorMessagesUserController.userNotFound);
        }

        if (result.role !== 'gate') {
            throw new Error(`${ErrorMessagesUserController.notUserGate}`);
        }

        await result.destroy();
        return `Gate User with username ${username} was deleted successfully.`;
    } catch (error) {
        if (error instanceof Error) {
            console.error(ErrorMessagesUserController.deleteUser, error.message);
            throw new Error(`${ErrorMessagesUserController.deleteUser} ${error.message}`);
        } else {
            console.error(ErrorMessagesUserController.deleteUser, error);
            throw new Error(ErrorMessagesUserController.deleteUser);
        }
    }
}

// UPDATE
export async function updateGateUser(username: string, newUsername: string): Promise<any> {
    try {
        let user = await User.findOne({ where: { username } });
        if (!user) {
            return null;
        }

        await User.update({ username: newUsername }, { where: { username } });
        await Gate.update({ username: newUsername }, { where: { username } });

        return await User.findOne({ where: { username: newUsername } });
    } catch (error) {
        if (error instanceof Error) {
            console.error(ErrorMessagesUserController.updateUser, error.message);
            throw new Error(`${ErrorMessagesUserController.updateUser} ${error.message}`);
        } else {
            console.error(ErrorMessagesUserController.updateUser, error);
            throw new Error(ErrorMessagesUserController.updateUser);
        }
    }
}

export async function returnAllUsers(req: any, res: any): Promise<any> {
    try {
        let users = await getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: `${ErrorMessagesUserController.unknownError} ${error.message}` });
        } else {
            res.status(500).json({ error: ErrorMessagesUserController.unknownError });
        }
    }
}

export async function returnGetUser(req: any, res: any, username: string) {
    try {
        let user = await getUser(username);
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ error: ErrorMessagesUserController.userNotFound });
        }
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: `${ErrorMessagesUserController.unknownError} ${error.message}` });
        } else {
            res.status(500).json({ error: ErrorMessagesUserController.unknownError });
        }
    }
}

export async function returnCreateUser(req: any, res: any, username: string): Promise<any> {
    try {
        const newGateUser = await createGateUser(username);
        res.status(201).json(newGateUser);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: `${ErrorMessagesUserController.createUser} ${error.message}` });
        } else {
            res.status(500).json({ error: ErrorMessagesUserController.createUser });
        }
    }
}

export async function returnUpdateUser(req: any, res: any, username: string, newUsername: string): Promise<any> {
    try {
        let user = await updateGateUser(username, newUsername);
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ error: ErrorMessagesUserController.userNotFound });
        }
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: `${ErrorMessagesUserController.updateUser} ${error.message}` });
        } else {
            res.status(500).json({ error: ErrorMessagesUserController.updateUser });
        }
    }
}

export async function returnDeleteUser(req: any, res: any, username: string): Promise<any> {
    try {
        let user = await deleteGateUser(username);
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ error: ErrorMessagesUserController.userNotFound });
        }
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: `${ErrorMessagesUserController.deleteUser} ${error.message}` });
        } else {
            res.status(500).json({ error: ErrorMessagesUserController.deleteUser });
        }
    }
}
