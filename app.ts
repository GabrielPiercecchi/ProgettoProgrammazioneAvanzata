import express from 'express';
import * as gatesModel from './models/gates';
import * as ticketsModel from './models/tickets';
import * as vehiclesModel from './models/vehicles';
import * as transitsModel from './models/transits';
import * as operatorsModel from './models/operators';
import * as sectionsModel from './models/sections';
import * as gatesController from './controllers/gatesController';
import * as sectionsController from './controllers/sectionsController';
import * as vehiclesController from './controllers/vehiclesController';
import * as transitsController from './controllers/transitsController';
import * as ticketsController from './controllers/ticketsController';
import * as gatesMiddleware from './middlewares/gatesMiddleware';
import * as vehiclesMiddleware from './middlewares/vehiclesMiddleware';
import * as sectionsMiddleware from './middlewares/sectionsMiddleware';
import * as transitsMiddleware from './middlewares/transitsMiddleware';
import * as ticketsMiddleware from './middlewares/ticketsMiddleware';



const app = express();
const port = process.env.SERVICE_PORT;

// Middleware per il parsing del corpo delle richieste in formato JSON
app.use(express.json());

let serverStarted = false;

// Open the server
app.listen(process.env.SERVICE_PORT, () => {
  console.log('Server is running on port 3000');
});

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
app.post('/gates', gatesMiddleware.sanitizeCreateGateInputs, async (req, res) => {
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

// Route getAllGates, @Francesco gli passiamo direttamente auth middleware
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
app.get('/gates/:username', gatesMiddleware.sanitizeGetGateInputs, async (req, res) => {
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
app.put('/gates/:location', gatesMiddleware.sanitizeUpdateGateInputs, async (req, res) => {
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
app.delete('/gates/:username', gatesMiddleware.sanitizeDeleteGateInputs, async (req, res) => {
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

// Section routes

// Route createSection
app.post('/sections', sectionsMiddleware.sanitizeCreateSectionInputs,async (req, res) => {
  const { initialGate, finalGate } = req.body;

  try {
    const newSection = await sectionsController.createSection(initialGate, finalGate);
    res.status(201).json(newSection);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Si è verificato un errore sconosciuto." });
    }
  }
});

// Route getAllSections
app.get('/sections', async (req, res) => {
  try {
    const sections = await sectionsModel.getAllSections();
    res.status(200).json(sections);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Si è verificato un errore sconosciuto." });
    }
  }
});

// Route getSection
app.get('/sections/:id', sectionsMiddleware.sanitizeGetSectionInputs, async (req, res) => {
  const { id } = req.params;

  try {
    // Convert id from string to number
    const sectionId = parseInt(id, 10); // Use parseInt with base 10

    const section = await sectionsModel.getSections(sectionId);
    if (section) {
      res.status(200).json(section);
    } else {
      res.status(404).json({ error: 'Section not found' });
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Si è verificato un errore sconosciuto." });
    }
  }
});

// Route updateSection
app.put('/sections/:id', sectionsMiddleware.sanitizeUpdateSectionInputs, async (req, res) => {
  const { id } = req.params;
  const { newInitialGate, newFinalGate } = req.body;

  try {
    // Convert id from string to number
    const sectionId = parseInt(id, 10); // Use parseInt with base 10

    const updatedSection = await sectionsController.updateSection(sectionId, newInitialGate, newFinalGate);
    if (updatedSection) {
      res.status(200).json(updatedSection);
    } else {
      res.status(404).json({ error: 'Section not found' });
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Si è verificato un errore sconosciuto." });
    }
  }
});

// Route deleteSection
app.delete('/sections/:id', sectionsMiddleware.sanitizeDeleteSectionInputs, async (req, res) => {
  const { id } = req.params;

  try {
    // Convert id from string to number
    const sectionId = parseInt(id, 10); // Use parseInt with base 10

    const result = await sectionsController.deleteSection(sectionId);
    res.status(200).json(result);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Si è verificato un errore sconosciuto." });
    }
  }
});

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

app.get('/vehicles/:type', vehiclesMiddleware.sanitizeGetVehicleInputs, async (req, res) => {
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

app.post('/vehicles', vehiclesMiddleware.sanitizeCreateVehicleInputs,async (req, res) => {
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

app.put('/vehicles/:type', vehiclesMiddleware.sanitizeUpdateVehicleInputs,async (req, res) => {
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

app.delete('/vehicles/:type', vehiclesMiddleware.sanitizeDeleteVehicleInputs, async (req, res) => {
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

app.get('/transits/:id', transitsMiddleware.sanitizeGetTransitInputs, async (req, res) => {
  const { id } = req.params;

  try {
    // Convert id from string to number
    const transitId = parseInt(id, 10); // Use parseInt with base 10

    const transit = await transitsModel.getTransit(transitId);
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

// Route to get all transits with plate "notFound"
app.get('/notFoundTransits', async (req, res) => {
  try {
      const tickets = await transitsModel.getAllNotFoundTickets();
      res.status(200).json(tickets);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Si è verificato un errore sconosciuto." });
    }
  }
});

// Create a new transit

app.post('/transits',transitsMiddleware.sanitizeCreateTransitInputs, async (req, res) => {
  const { plate, speed, weather, vehicles_types, gate } = req.body;

  try {
    const newTransit = await transitsController.createTransit(
      plate,
      speed,
      weather,
      vehicles_types,
      gate,
    );
    res.status(201).json(newTransit);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Si è verificato un errore sconosciuto." });
    }
  }
});

// Update a transit

app.put('/transits/:id',transitsMiddleware.sanitizeUpdateTransitInputs, async (req, res) => {
  const { id } = req.params;
  console.log(typeof(id));
  const { newPlate, newSpeed, newWeather, newVehicles_types, newGate } = req.body;
 
  try {
    // Convert id from string to number
    const transitId = parseInt(id, 10); // Use parseInt with base 10
    //const newDate = new Date(newTransit_date);
    console.log(typeof(transitId));
    const updatedTransit = await transitsController.updateTransit(transitId, newPlate, newSpeed, newWeather, newVehicles_types, newGate);
    if (updatedTransit) {
      res.status(200).json(updatedTransit);
    } else {
      res.status(404).json({ error: 'Section not found' });
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Si è verificato un errore sconosciuto." });
    }
  }
});

// Delete a transit

app.delete('/transits/:id', transitsMiddleware.sanitizeDeleteTransitInputs, async (req, res) => {
  const { id } = req.params;

  try {
    const transitId = parseInt(id, 10)
    const deletedTransit = await transitsController.deleteTransit(transitId);
    res.status(200).json(deletedTransit);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Si è verificato un errore sconosciuto." });
    }
  }
});


// Ticket routes

// Get all tickets
app.get('/tickets', async (req, res) => {
  try {
    const tickets = await ticketsModel.getAllTickets();
    res.status(200).json(tickets);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Si è verificato un errore sconosciuto." });
    }
  }
});

// Get tickets by plates and time
app.post('/tickets', ticketsMiddleware.sanitizeGetTicketsInputs, async (req, res) => {
  const { plates, startDate, endDate } = req.body;

  // Converte plates in un array
  const platesArray = plates ? plates.split(', ') : [];

  try {
    const tickets = await ticketsModel.getTicketsByPlatesAndTime(platesArray, startDate, endDate);
    if (tickets.length > 0) {
      res.status(200).json(tickets);
    } else {
      res.status(404).json({ error: 'Tickets not found' });
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Si è verificato un errore sconosciuto." });
    }
  }
});

// Get section with most tickets
app.get('/mostTicketsSection', async (req, res) => {
  try {
    const section = await ticketsController.getSectionWithMostTickets();
    if (section) {
      res.status(200).json(section);
    } else {
      res.status(404).json({ error: 'Section not found' });
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Si è verificato un errore sconosciuto." });
    }
  }
});

// Get section with highest and lowest speed
app.get('/speedSection', async (req, res) => {
  try {
    const section = await ticketsController.getSectionWithHighestAndLowestSpeed();
    if (section) {
      res.status(200).json(section);
    } else {
      res.status(404).json({ error: 'Section not found' });
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Si è verificato un errore sconosciuto." });
    }
  }
});