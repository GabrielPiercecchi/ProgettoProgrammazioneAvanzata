import express from 'express';
import bodyParser from 'body-parser';
import { createGate } from './controllers/gatesController';
import { checkIfGateExists, getAllGates, Gate } from './models/gates';
import { getAllOp } from './models/operators';
import { DBIsConnected } from './database/database';
import { Transit } from './models/transits';
import { Vehicle } from './models/vehicles';

const app = express();
const port = process.env.SERVICE_PORT || 3000;

// Middleware per il parsing del corpo delle richieste in formato JSON
app.use(express.json());

let serverStarted = false;

// Define a test route
app.get('/test', (req, res) => {
  res.send('This is a test route!');
});

// Define a GET ALL operator route
app.get('/operator', (req, res) => {
  getAllOp();
});

// Gates routes

// Route createGate
app.post('/gates', async (req, res) => {
  const { location, username, password } = req.body;

  try {
    const newGate = await createGate(location, username, password);
    res.status(201).json(newGate);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Si è verificato un errore sconosciuto." });
    }
  }
});

// Route view allgates
app.get('/gates', async (req, res) => {
  try {
    const gates = await getAllGates();
    res.status(200).json(gates);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Si è verificato un errore sconosciuto." });
    }
  }
});



// Gates routes

// Route createTransit
app.post('/transits', async (req, res) => {
  const { plate, transit_date, speed, weather, vehicles_types, gate, used } = req.body;

  try {
    const newTransit = await Transit.create({
      plate,
      transit_date,
      speed,
      weather,
      vehicles_types,
      gate,
      used
    });
    res.status(201).json(newTransit);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Si è verificato un errore sconosciuto." });
    }
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

// Sync db and start server
// async function startServer() {
//   try {
//     await DBIsConnected.getInstance().authenticate();
//     console.log('Connection to the database has been established successfully.');

//     // await Gate.sync(); // Sync modedel Gate with the db
//     // await Transit.sync(); // Sync model Transit with the db
//     // await Vehicle.sync(); // Sync model Vehicle with the db
//     console.log('Database synchronized');

//     if (!serverStarted) {
//       app.listen(port, () => {
//         console.log(`Server is running at http://localhost:${port}`);
//         serverStarted = true;
//       });
//     }
//   } catch (error) {
//     console.error('Unable to connect to the database:', error);
//   }
// }

// startServer();