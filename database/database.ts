import {Sequelize} from 'sequelize';

/**
 *  The DBAccess class is a Singleton class responsible for connectiong to the database
 *  and ensuring that only one connection is made.
 */

export class DBIsConnected {

    private static instance: DBIsConnected;

    private connection: Sequelize;

    private constructor() {
        this.connection = new Sequelize(process.env.POSTGRES_DB!, process.env.POSTGRES_USER!, process.env.POSTGRES_PASSWORD!, {
            host: process.env.POSTGRES_HOST,
            port: Number(process.env.POSTGRES_PORT),
            dialect: 'postgres'
        });
    }

    public static getInstance(): Sequelize {
        if (!DBIsConnected.instance) {
            DBIsConnected.instance = new DBIsConnected();
        }

        return DBIsConnected.instance.connection;
    }
}