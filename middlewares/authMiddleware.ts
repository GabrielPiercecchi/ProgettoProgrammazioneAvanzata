import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/users';
import { where } from 'sequelize';

export const authentication = (req: Request, res: Response, next: NextFunction) => {
    try{
        const { auth } = req.headers;
        if(!auth){
            
            res.header('content-type', 'application/json');
            return res.status(401).send({message: 'Unauthorized 1'});
        }
        const token: string = req.headers.authorization!.split(' ')[1]; // ! is used to tell typescript that the value is not null
        if(!process.env.PRIVATE_KEY){
            return res.status(500).send({message: 'Internal Server Error'});
        }
        const privateKey: string = process.env.PRIVATE_KEY!;
        const decoded: any = jwt.verify(token, privateKey, {algorithms: ['RS256']});
        if(!decoded){
            res.header('content-type', 'application/json');
            return res.status(401).send({message: 'Unauthorized 2'});
        }
        req.body.user = decoded;
        next();

    }catch(error) {
        res.header('content-type', 'application/json');
        return res.status(401).send({message: 'Unauthorized 3'});
    }
};

export function checkOperator(req: Request, res: Response, next: NextFunction) {
    const user = req.body.user;

    let result: any;

    result = User.findByPk(user.username);
    if(!result){
        res.header('content-type', 'application/json');
        return res.status(401).send({message: 'User not found'});
    }
    if(user.role === 'operator'){
        next();
    } else {
        res.header('content-type', 'application/json');
        return res.status(401).send({message: 'Unauthorized'});

}
}

export function checkGate(req: Request, res: Response, next: NextFunction){
    if(req.body.user.role === 'gate'){
        next();
    } else{
        res.header('content-type', 'application/json');
        return res.status(401).send({message: 'Unauthorized'});
    }
}

export function checkDriver(req: Request, res: Response, next: NextFunction){
    if(req.body.user.role === 'driver'){
        next();
    } else{
        res.header('content-type', 'application/json');
        return res.status(401).send({message: 'Unauthorized'});
    }
}

export function checkOperatororGates(req: Request, res: Response, next: NextFunction){
    if(req.body.user.role === 'operator' || req.body.user.role === 'gate'){
        next();
    } else{
        res.header('content-type', 'application/json');
        return res.status(401).send({message: 'Unauthorized'});
    }
}

export function checkOperatorDriver(req: Request, res: Response, next: NextFunction){
    if(req.body.user.role === 'operator')  {
        next();
    }
    if(req.body.user.role === 'driver'){
        let drivers: any;
        try {
            drivers = User.findOne({ where: { username: req.body.user.username } });
            if(drivers.length === 0){
                res.header('content-type', 'application/json');
                return res.status(401).send({message: 'Unauthorized'});
            }
            if (!drivers) {
                res.header('content-type', 'application/json');
                return res.status(401).send({message: 'Unauthorized'});
            }
            next();
        }
        catch(error){
            res.header('content-type', 'application/json');
            return res.status(401).send({message: 'Unauthorized'});
        }
    }
     else{
        res.header('content-type', 'application/json');
        return res.status(401).send({message: 'Unauthorized'});
    }
}

