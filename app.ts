import express from 'express';
import bodyParser from 'body-parser';
import { createGate } from './controllers/gatesController';
import { checkIfGateExists, getAllGates, Gate } from './models/gates';
import { getAllOp } from './models/operator';
import { DBIsConnected } from './database/database';

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

// Rotta per inserire un nuovo gate
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

// Rotta per mostrare tutte le istanze della tabella gates
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

// Sincronizza il database e avvia il server
async function startServer() {
  try {
    await DBIsConnected.getInstance().authenticate();
    console.log('Connection to the database has been established successfully.');

    await Gate.sync(); // Sincronizza il modello Gate con il database
    console.log('Database synchronized');

    if (!serverStarted) {
      app.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
        serverStarted = true;
      });
    }
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

startServer();