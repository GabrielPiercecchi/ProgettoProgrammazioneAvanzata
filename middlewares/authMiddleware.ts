import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/users';
import { ErrorMessagesAuth } from '../messages/errorMessages';

/**
 * Middleware for user authentication using JWT token.
 * 
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Next middleware function
 */
export const authentication = (req: Request, res: Response, next: NextFunction) => {
    try {
        const { authorization } = req.headers;

        // Check if authorization header is missing
        if (!authorization) {
            res.header('content-type', 'application/json');
            return res.status(401).send({ message: ErrorMessagesAuth.unauthorized });
        }

        // Extract token from authorization header
        const token: string = req.headers.authorization!.split(' ')[1]; // ! is used to tell typescript that the value is not null

        // Check if PRIVATE_KEY environment variable is missing
        if (!process.env.PRIVATE_KEY) {
            return res.status(500).send({ message: ErrorMessagesAuth.invalidEnvToken });
        }

        // Verify JWT token using private key
        const privateKey: string = process.env.PRIVATE_KEY!;
        const decoded: any = jwt.verify(token, privateKey, { algorithms: ['RS256'] });

        // If token is not decoded properly
        if (!decoded) {
            res.header('content-type', 'application/json');
            return res.status(401).send({ message: ErrorMessagesAuth.failedToDecode });
        }

        // Attach decoded user information to request body
        req.body.user = decoded;
        next();

    } catch (error) {
        console.error('Error in authentication middleware:', error);
        res.header('content-type', 'application/json');
        return res.status(401).send({ message: ErrorMessagesAuth.internalServerError });
    }
};

/**
 * Middleware to check if the user has the role 'operator'.
 * 
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Next middleware function
 */
export async function checkOperator(req: Request, res: Response, next: NextFunction) {
    const user = req.body.user;
    let result: any;
    try {
        // Find user by username in database
        result = await User.findByPk(user.username);

        // If user is not found
        if (!result) {
            res.header('content-type', 'application/json');
            return res.status(401).send({ message: ErrorMessagesAuth.userNotFound });
        }

        // Check if user is an operator and has necessary permissions
        if (user.role === 'operator' && result.role === 'operator' && result.username === user.username) {
            if (result.token > 0) {
                // Decrease token count and save to database
                result.token = result.token - 1;
                await result.save();
                next();
            }
            else {
                // Handle unauthorized access
                result.token = 10;
                await result.save();
                res.header('content-type', 'application/json');
                return res.status(401).send({ message: ErrorMessagesAuth.terminatedToken + "0", token: result.token });
            }
        } else {
            res.header('content-type', 'application/json');
            return res.status(401).send({ message: ErrorMessagesAuth.unauthorized });

        }
    } catch (error) {
        console.error('Error in checkOperator middleware:', error);
        res.header('content-type', 'application/json');
        return res.status(500).send({ message: ErrorMessagesAuth.internalServerError });
    }
}

/**
 * Middleware to check if the user is an operator or gate.
 * 
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Next middleware function
 */
export async function checkOperatororGates(req: Request, res: Response, next: NextFunction) {
    const user = req.body.user;
    let result: any;
    try {
        // Find user by username in database
        result = await User.findByPk(user.username);

        // If user is not found
        if (!result) {
            res.header('content-type', 'application/json');
            return res.status(401).send({ message: ErrorMessagesAuth.userNotFound });
        }

        // Check if user is an operator or gate and has necessary permissions
        if ((user.role === 'operator' && result.role === 'operator' && result.username === user.username) ||
            (user.role === 'gate' && result.role === 'gate' && result.username === user.username)) {

            if (result.token > 0) {
                // Decrease token count and save to database
                result.token = result.token - 1;
                await result.save();
                next();
            } else {
                // Handle unauthorized access
                result.token = 10;
                await result.save();
                res.header('content-type', 'application/json');
                return res.status(401).send({ message: ErrorMessagesAuth.terminatedToken + "0", token: result.token });
            }
        }
        else {
            res.header('content-type', 'application/json');
            return res.status(401).send({ message: ErrorMessagesAuth.unauthorized });
        }
    } catch (error) {
        console.error('Error in checkOperatorGate middleware:', error);
        res.header('content-type', 'application/json');
        return res.status(500).send({ message: ErrorMessagesAuth.internalServerError });
    }
}

/**
 * Middleware to check if the user is an operator or driver.
 * 
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Next middleware function
 */
export async function checkOperatorDriver(req: Request, res: Response, next: NextFunction) {
    let result: any;
    try {
        result = await User.findByPk(req.body.user.username);

        // If user is not found
        if (!result) {
            res.header('content-type', 'application/json');
            return res.status(401).send({ message: ErrorMessagesAuth.userNotFound });
        }
        // Check if user is an operator or driver and has necessary permissions
        if ((req.body.user.role === 'operator' && result.role === 'operator') ||
            (req.body.user.role === 'driver' && result.role === 'driver')) {
            if (result.token > 0) {
                result.token = result.token - 1;
                await result.save();
                next();
            } else {
                result.token = 10;
                await result.save();
                res.header('content-type', 'application/json');
                return res.status(401).send({ message: ErrorMessagesAuth.terminatedToken + "0", token: result.token });
            }
        }
        else {
            res.header('content-type', 'application/json');
            return res.status(401).send({ message: ErrorMessagesAuth.unauthorized });
        }
    }
    catch (error) {
        console.error('Error in checkOperatorGate middleware:', error);
        res.header('content-type', 'application/json');
        return res.status(500).send({ message: ErrorMessagesAuth.internalServerError });
    }
}
