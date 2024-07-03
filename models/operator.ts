import { DBIsConnected } from "../database/database";
import { DataTypes, Sequelize, Model } from 'sequelize';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

dotenv.config();

const SALT_ROUNDS = 10;

//Connection to DataBase
const sequelize: Sequelize = DBIsConnected.getInstance();

/**
 * model 'Operator'
 *
 * Define the model 'Operator'
 */
export const Operator = sequelize.define('operator', {
    id_operator: { 
        type: DataTypes.STRING, 
        defaultValue: process.env.DEFAULT_ID_OPERATOR, 
        primaryKey: true },
    username: { 
        type: DataTypes.STRING,
        defaultValue: process.env.DEFAULT_USERNAME_OPERATOR, 
        allowNull: false, 
        unique: true }, //TODO:regex
    password: { 
        type: DataTypes.STRING, 
        defaultValue: process.env.DEFAULT_PASSWORD_OPERATOR, 
        allowNull: false }, //TODO:regex
},
    {
        modelName: 'operator',
        timestamps: false,
        /**
         * This hook is trigerred before the creation of the instance
         * 
         * operator and checks if the id_operator is equal to is default value
         */
        hooks: {
            beforeCreate: async (operator, options) => {
                if (operator.getDataValue('id_operator') !== process.env.DEFAULT_ID_OPERATOR) {
                    throw new Error('Id_operator cannot be changed.');
                }
                if ((operator as any).changed('password')) {
                    (operator as any).password = await bcrypt.hash((operator as any).password, SALT_ROUNDS);
                }
            },
        },
    });
