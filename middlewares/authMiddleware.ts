import e, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Driver } from '../models/drivers';

export const authentication = (req: Request, res: Response, next: NextFunction) => {
    try{
        const { auth } = req.headers;
        if(!auth){
            res.header('content-type', 'application/json');
            res.status(401).send({message: 'Unauthorized'});
        }
        const token: string = req.headers.authorization!.split(' ')[1]; // ! is used to tell typescript that the value is not null
        if(!process.env.PRIVATE_KEY){
            res.status(500).send({message: 'Internal Server Error'});
        }
        const privateKey: string = process.env.PRIVATE_KEY!;
        const decoded: any = jwt.verify(token, privateKey, {algorithms: ['RS256']});
        if(!decoded){
            res.header('content-type', 'application/json');
            res.status(401).send({message: 'Unauthorized'});
        }
        req.body.user = decoded;
        next();

    }catch(error) {
        res.header('content-type', 'application/json');
        res.status(401).send({message: 'Unauthorized'});
    }
};

export function checkOperator(req: Request, res: Response, next: NextFunction){
    if(req.body.user.role === 'operator'){
        next();
    } else{
        res.header('content-type', 'application/json');
        res.status(401).send({message: 'Unauthorized'});
    }
}

export function checkGate(req: Request, res: Response, next: NextFunction){
    if(req.body.user.role === 'gate'){
        next();
    } else{
        res.header('content-type', 'application/json');
        res.status(401).send({message: 'Unauthorized'});
    }
}

export function checkDriver(req: Request, res: Response, next: NextFunction){
    if(req.body.user.role === 'driver'){
        next();
    } else{
        res.header('content-type', 'application/json');
        res.status(401).send({message: 'Unauthorized'});
    }
}

export function checkOperatororGates(req: Request, res: Response, next: NextFunction){
    if(req.body.user.role === 'operator' || req.body.user.role === 'gate'){
        next();
    } else{
        res.header('content-type', 'application/json');
        res.status(401).send({message: 'Unauthorized'});
    }
}

export function checkOperatorDriver(req: Request, res: Response, next: NextFunction){
    if(req.body.user.role === 'operator')  {
        next();
    }
    if(req.body.user.role === 'driver'){
        let drivers: any;
        try {
            drivers = Driver.findOne({ where: { username: req.body.user.username, password: req.body.user.password } });
            if(drivers.length === 0){
                res.header('content-type', 'application/json');
                res.status(401).send({message: 'Unauthorized'});
            }
            if(drivers = )
            next();
        }
        catch(error){
            res.header('content-type', 'application/json');
            res.status(401).send({message: 'Unauthorized'});
        }
    }
     else{
        res.header('content-type', 'application/json');
        res.status(401).send({message: 'Unauthorized'});
    }
}



