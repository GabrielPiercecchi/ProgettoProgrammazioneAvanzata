import { DBIsConnected } from "../database/database";
import { DataTypes, Sequelize, Model } from 'sequelize';
import { Vehicle } from './vehicles'; // Import the Vehicle model
import { Gate } from './gates'; // Import the Gates model

const sequelize: Sequelize = DBIsConnected.getInstance();

export const Transit = sequelize.define('transits', {
    plate: { 
        type: DataTypes.STRING, 
        allowNull: false, 
        primaryKey: true},
    transit_date: { 
        type: DataTypes.DATE, 
        allowNull: false, 
        primaryKey: true},
    speed: { 
        type: DataTypes.INTEGER, 
        allowNull: false},
    weather: { 
        type: DataTypes.ENUM('good weather, bad weather'), 
        defaultValue: 'good weather',
        allowNull: false},
    vehicles_types: { 
        type: DataTypes.STRING, 
        allowNull: false, 
        references:{
            model: Vehicle, 
            key: 'type'
        } 
    },
    gate: {
        type: DataTypes.STRING, 
        allowNull: false, 
        references:{
            model: Gate, 
            key: 'location'
        }
    },
    // Boolean value to check if the transit is in use in the tickets Database
    used: {
        type: DataTypes.BOOLEAN, 
        defaultValue: false,
        allowNull: false
    }

}, {
        modelName: 'transits',
        timestamps: false, //TODO: hooks
    });
