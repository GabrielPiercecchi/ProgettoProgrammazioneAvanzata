import express from 'express';
import bodyParser from 'body-parser';
import { DBIsConnected } from './database/database';


import * as gatesModel from './models/gates';
import * as vehiclesModel from './models/vehicles';
import * as transitsModel from './models/transits';
import * as operatorsModel from './models/operators';


import * as gatesController from './controllers/gatesController';
import * as vehiclesController from './controllers/vehiclesController';
import * as transitsController from './controllers/transitsController';


const app = express();
const port = process.env.SERVICE_PORT || 3000;

// Middleware per il parsing del corpo delle richieste in formato JSON
app.use(express.json());

let serverStarted = false;

// Define a test route
app.get('/test', (req, res) => {
  res.send('This is a test route!');
});

// Operator routes 

// Route getAllOp
app.get('/operators', async (req, res) => {
  try {
    const operators = await operatorsModel.getAllOp();
    res.status(200).json(operators);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Si è verificato un errore sconosciuto." });
    }
  }
});

// Gates routes

// Route createGates
app.post('/gates', async (req, res) => {
  const { location, username, password } = req.body;

  try {
    const newGate = await gatesController.createGate(location, username, password);
    res.status(201).json(newGate);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Si è verificato un errore sconosciuto." });
    }
  }
});

// Route getAllGates
app.get('/gates', async (req, res) => {
  try {
    const gates = await gatesModel.getAllGates();
    res.status(200).json(gates);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Si è verificato un errore sconosciuto." });
    }
  }
});

// Route getGates
app.get('/gates/:username', async (req, res) => {
  const { username } = req.params;

  try {
    const gate = await gatesModel.getGates(username);
    if (gate) {
      res.status(200).json(gate);
    } else {
      res.status(404).json({ error: 'Gate not found' });
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Si è verificato un errore sconosciuto." });
    }
  }
});

//Route updateGates
app.put('/gates/:location', async (req, res) => {
  const { location } = req.params;
  const { newUsername, newPassword } = req.body;

  try {
    const updatedGate = await gatesController.updateGate(location, newUsername, newPassword);
    if (updatedGate) {
      res.status(200).json(updatedGate);
    } else {
      res.status(404).json({ error: 'Gate not found' });
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Si è verificato un errore sconosciuto." });
    }
  }
});

// Route deleteGates
app.delete('/gates/:username', async (req, res) => {
  const { username } = req.params;

  try {
    const gate = await gatesController.deleteGate(username);
    if (gate) {
      res.status(200).json(gate);
    } else {
      res.status(404).json({ error: 'Gate not found' });
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Si è verificato un errore sconosciuto." });
    }
  }
});

// Route deleteGates

// Gates routes

// // Route createTransit
// app.post('/transits', async (req, res) => {
//   const { plate, transit_date, speed, weather, vehicles_types, gate, used } = req.body;

//   try {
//     const newTransit = await .create({
//       plate,
//       transit_date,
//       speed,
//       weather,
//       vehicles_types,
//       gate,
//       used
//     });
//     res.status(201).json(newTransit);
//   } catch (error) {
//     if (error instanceof Error) {
//       res.status(500).json({ error: error.message });
//     } else {
//       res.status(500).json({ error: "Si è verificato un errore sconosciuto." });
//     }
//   }
// });

// Vehicles routes

// Get all vehicles

app.get('/vehicles', async (req, res) => {
  try {
    const vehicles = await vehiclesModel.getAllVehicles();
    res.status(200).json(vehicles);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Si è verificato un errore sconosciuto." });
    }
  }
});

// Get vehicles by type

app.get('/vehicles/:type', async (req, res) => {
  const { type } = req.params;
  try {
    const vehicle = await vehiclesModel.getVehicles(type);
    if (vehicle) {
      res.status(200).json(vehicle);
    } else {
      res.status(404).json({ error: 'Vehicle not found.' });
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Si è verificato un errore sconosciuto." });
    }
  }
});

// Create a new vehicle

app.post('/vehicles', async (req, res) => {
  const { type, limit } = req.body;

  try {
    const newVehicle = await vehiclesController.createVehicle(type, limit);
    res.status(201).json(newVehicle);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Si è verificato un errore sconosciuto." });
    }
  }
});

// Update a vehicle

app.put('/vehicles/:type', async (req, res) => {
  const { type } = req.params;
  const { newLimit } = req.body;

  try {
    const updatedVehicle = await vehiclesController.updateVehicle(type, newLimit);
    res.status(201).json(updatedVehicle);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Si è verificato un errore sconosciuto." });
    }
  }
});

// Delete a vehicle

app.delete('/vehicles/:type', async (req, res) => {
  const { type } = req.params;

  try {
    const deletedVehicle = await vehiclesController.deleteVehicle(type);
    res.status(200).json(deletedVehicle);
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

// Transits routes

// Get all transits

app.get('/transits', async (req, res) => {
  try {
    const transits = await transitsModel.getAllTransits();
    res.status(200).json(transits);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Si è verificato un errore sconosciuto." });
    }
  }
});

// Get a specific transit

app.get('/transits/:plate/:transit_date', async (req, res) => {
  const { plate, transit_date } = req.params;
  const parsedTransitDate = new Date(transit_date);

  try {
    const transit = await transitsModel.getTransit(plate, parsedTransitDate);
    if (transit) {
      res.status(200).json(transit);
    } else {
      res.status(404).json({ error: 'Transit not found' });
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Si è verificato un errore sconosciuto." });
    }
  }
});
//   const { plate, transit_date } = req.params;

//   try {
//     const transit = await transitsModel.getTransit(plate, transit_date);
//     if (transit) {
//       res.status(200).json(transit);
//     } else {
//       res.status(404).json({ error: 'Transit not found' });
//     }
//   } catch (error) {
//     if (error instanceof Error) {
//       res.status(500).json({ error: error.message });
//     } else {
//       res.status(500).json({ error: "Si è verificato un errore sconosciuto." });
//     }
//   }
// });


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