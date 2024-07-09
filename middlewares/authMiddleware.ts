import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/users';

export const authentication = (req: Request, res: Response, next: NextFunction) => {
    try {
        const { authorization } = req.headers;
        console.log(req.headers)
        if (!authorization) {
            console.log(authorization)
            res.header('content-type', 'application/json');
            return res.status(401).send({ message: 'Unauthorized' });
        }
        const token: string = req.headers.authorization!.split(' ')[1]; // ! is used to tell typescript that the value is not null
        if (!process.env.PRIVATE_KEY) {
            return res.status(500).send({ message: 'Internal Server Error' });
        }
        const privateKey: string = process.env.PRIVATE_KEY!;
        const decoded: any = jwt.verify(token, privateKey, { algorithms: ['RS256'] });
        if (!decoded) {
            res.header('content-type', 'application/json');
            return res.status(401).send({ message: 'Failed to decode' });
        }
        req.body.user = decoded;
        next();

    } catch (error) {
        res.header('content-type', 'application/json');
        return res.status(401).send({ message: 'Internal server error' });
    }
};

// export async function checkOperator(req: Request, res: Response, next: NextFunction) {
//     const user = req.body.user;
//     let result: any;
//     try {
//         // Esegui la query per trovare l'utente per username
//         result = await User.findByPk(user.username);

//         // Verifica se l'utente non è stato trovato
//         if (!result) {
//             res.header('content-type', 'application/json');
//             return res.status(401).send({ message: 'User not found' });
//         }

//         // Verifica se l'utente è un operatore e se ha i permessi necessari
//         if (user.role === 'operator' && result.role === 'operator' && result.username === user.username && result.token > 0) {
//             // Esegui l'operazione di decremento del token e salva il risultato nel database
//             result.token = result.token - 1;
//             await result.save(); // Assicurati di attendere il salvataggio

//             // Passa al middleware successivo
//             next();
//         }
//         if(result.token === 0){
//             // Se l'utente non è autorizzato, gestisci di conseguenza
//             result.token = 10;
//             await result.save(); // Assicurati di attendere il salvataggio
//             res.header('content-type', 'application/json');
//             return res.status(401).send({message: 'Token is 0, need to refresh it'});
//         }
//          else {
//             res.header('content-type', 'application/json');
//             return res.status(401).send({ message: 'Unauthorized' });
//         }
//     } catch (error) {
//         console.error('Error in checkOperator middleware:', error);
//         res.header('content-type', 'application/json');
//         return res.status(500).send({ message: 'Internal Server Error' });
//     }
// }

export async function checkOperator(req: Request, res: Response, next: NextFunction) {
    const user = req.body.user;
    let result: any;
    try {
        // Esegui la query per trovare l'utente per username
        result = await User.findByPk(user.username);

        // Verifica se l'utente non è stato trovato
        if (!result) {
            res.header('content-type', 'application/json');
            return res.status(401).send({ message: 'User not found' });
        }

        // Verifica se l'utente è un operatore e se ha i permessi necessari
        if (user.role === 'operator' && result.role === 'operator' && result.username === user.username && result.token > 0) {
            // Esegui l'operazione di decremento del token e salva il risultato nel database
            result.token = result.token - 1;
            await result.save(); // Assicurati di attendere il salvataggio

            // Passa al middleware successivo
            next();
        } else {
            // Se l'utente non è autorizzato, gestisci di conseguenza
            result.token = 10;
            await result.save(); // Assicurati di attendere il salvataggio

            res.header('content-type', 'application/json');
            return res.status(401).send({ message: 'You are unauthorized' });
        }
    } catch (error) {
        console.error('Error in checkOperator middleware:', error);
        res.header('content-type', 'application/json');
        return res.status(500).send({ message: 'Internal Server Error' });
    }
}

export async function checkOperatororGates(req: Request, res: Response, next: NextFunction) {
    const user = req.body.user;
    let result: any;
    try {
        // Esegui la query per trovare l'utente per username
        result = await User.findByPk(user.username);

        // Verifica se l'utente non è stato trovato
        if (!result) {
            res.header('content-type', 'application/json');
            return res.status(401).send({ message: 'User not found' });
        }

        // Verifica se l'utente è un operatore e se ha i permessi necessari
        if ((user.role === 'operator' && result.role === 'operator' && result.username === user.username) ||
            (user.role === 'gate' && result.role === 'gate' && result.username === user.username) && result.token > 0) {
            // Esegui l'operazione di decremento del token e salva il risultato nel database
            result.token = result.token - 1;
            await result.save(); // Assicurati di attendere il salvataggio

            // Passa al middleware successivo
            next();
        }
        else {
            // Se l'utente non è autorizzato, gestisci di conseguenza
            result.token = 10;
            await result.save(); // Assicurati di attendere il salvataggio

            res.header('content-type', 'application/json');
            return res.status(401).send({ message: 'You are unauthorized' });
        }
    } catch (error) {
        console.error('Error in checkOperator middleware:', error);
        res.header('content-type', 'application/json');
        return res.status(500).send({ message: 'Internal Server Error' });
    }

}

export async function checkOperatorDriver(req: Request, res: Response, next: NextFunction) {
    const user = req.body.user;
    let result: any;
    try {
        // Esegui la query per trovare l'utente per username
        result = await User.findByPk(user.username);

        // Verifica se l'utente non è stato trovato
        if (!result) {
            res.header('content-type', 'application/json');
            return res.status(401).send({ message: 'User not found' });
        }

        // Verifica se l'utente è un operatore e se ha i permessi necessari
        if ((user.role === 'operator' && result.role === 'operator' && result.username === user.username) ||
            (user.role === 'driver' && result.role === 'driver' && result.username === user.username) && result.token > 0) {
            // Esegui l'operazione di decremento del token e salva il risultato nel database
            result.token = result.token - 1;
            await result.save(); // Assicurati di attendere il salvataggio

            // Passa al middleware successivo
            next();
        }
        else {
            // Se l'utente non è autorizzato, gestisci di conseguenza
            result.token = 10;
            await result.save(); // Assicurati di attendere il salvataggio

            res.header('content-type', 'application/json');
            return res.status(401).send({ message: 'You are unauthorized' });
        }
    } catch (error) {
        console.error('Error in checkOperator middleware:', error);
        res.header('content-type', 'application/json');
        return res.status(500).send({ message: 'Internal Server Error' });
    }

}

