import { Request, Response } from 'express';
import { Transit } from '../models/transits';
import { DBIsConnected } from "../database/database";
import { DataTypes, Sequelize, Model } from 'sequelize';

const sequelize: Sequelize = DBIsConnected.getInstance();

export const createTransit = async (req: Request, res: Response): Promise<void> => {

    console.log(req.body);
    try {
        //const transit_input = req.body;
        const newTransit = await Transit.create({
            plate: req.body.plate,
            transit_date: req.body.transit_date,
            speed: req.body.speed,
            weather: req.body.weather,
            vehicles_types: req.body.vehicles_types,
            gate: req.body.gate,
            used: req.body.used
        });
        //await newTransit.save();
        res.status(201).json({ message: 'Transit created successfully', data: newTransit });
    } catch (error) {
        const err = error as Error;
        // Gestisci l'errore e invia una risposta di errore
        res.status(500).json({ message: 'Error creating transit', error: err.message });
        //console.log(req.body);
    }
}