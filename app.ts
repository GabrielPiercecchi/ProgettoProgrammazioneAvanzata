import express from 'express';
import * as gatesModel from './models/gates';
import * as ticketsModel from './models/tickets';
import * as vehiclesModel from './models/vehicles';
import * as transitsModel from './models/transits';
import * as sectionsModel from './models/sections';
import * as usersModel from './models/users';
import * as gatesController from './controllers/gatesController';
import * as sectionsController from './controllers/sectionsController';
import * as vehiclesController from './controllers/vehiclesController';
import * as transitsController from './controllers/transitsController';
import * as ticketsController from './controllers/ticketsController';
import * as usersController from './controllers/usersController';
import * as vehiclesMiddleware from './middlewares/vehiclesMiddleware';
import * as transitsMiddleware from './middlewares/transitsMiddleware';
import * as ticketsMiddleware from './middlewares/ticketsMiddleware';
import * as usersMiddleware from './middlewares/usersMiddleware';
import * as pipe from './middlewares/pipeline';



const app = express();
const port = process.env.SERVICE_PORT;

// Middleware per il parsing del corpo delle richieste in formato JSON
app.use(express.json());

let serverStarted = false;

// Open the server
app.listen(process.env.SERVICE_PORT, () => {
  console.log('Server is running on port 3000');
});

// Users routes

// Route createUser
app.post('/users', usersMiddleware.sanitizeCreateGateUserInputs, async (req, res) => {
  const { username } = req.body;
  try {
    const newGateUser = await usersController.createGateUser(username);
    res.status(201).json(newGateUser);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Si è verificato un errore sconosciuto." });
    }
  }
});

// Route getAllUsers
app.get('/users', async (req, res) => {
  let users: any;
  try {
    users = await usersModel.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Si è verificato un errore sconosciuto." });
    }
  }
});

// Route getUser
app.get('/users/:username', usersMiddleware.sanitizeGetGateUserInputs, async (req, res) => {
  const { username } = req.params;
  let user: any;
  try {
    user = await usersModel.getUsers(username);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred." });
    }
  }
});

// Route updateUser
app.put('/users/:username', usersMiddleware.sanitizeUpdateGateUserInputs, async (req, res) => {
  const { username } = req.params;
  const { newUsername } = req.body;
  let user: any;
  try {
    user = await usersController.updateGateUser(username, newUsername);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred." });
    }
  }
});

// Route deleteUser
app.delete('/users/:username', usersMiddleware.sanitizeDeleteGateUserInputs, async (req, res) => {
  const { username } = req.params;
  let user: any;
  try {
    user = await usersController.deleteGateUser(username);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred." });
    }
  }
});

// Gates routes

// Route createGates
app.post('/gates', pipe.createGate, async (req: any, res: any) => {
  const { location, username } = req.body;

  gatesController.returnCreateGate(req, res, location, username);
});

// Route getAllGates
app.get('/gates', pipe.getAll, async (req: any, res: any) => {

  gatesController.returnAllGates(req, res);
  
});

// Route getGates
app.get('/gates/:location', pipe.getGate, async (req: any, res: any) => {
  const { location } = req.params;
  gatesController.returnGate(req, res, location);
});

//Route updateGates
app.put('/gates/:location', pipe.updateGate, async (req: any, res: any) => {
  const { location } = req.params;
  const { newUsername } = req.body;
  gatesController.returnUpdateGate(req, res, location, newUsername);
});

// Route deleteGates
app.delete('/gates/:location', pipe.deleteGate, async (req: any, res: any) => {
  const { location } = req.params;
  gatesController.returnDeleteGate(req, res, location);
});

// Section routes

// Route createSection
app.post('/sections', pipe.createSection, async (req: any, res: any) => {
  const { initialGate, finalGate } = req.body;
  sectionsController.returnCreateSection(req, res, initialGate, finalGate);
});

// Route getAllSections
app.get('/sections', pipe.getAll, async (req: any, res: any) => {

  sectionsController.returAllSections(req, res);
  
});

// Route getSection
app.get('/sections/:id', pipe.getSection, async (req: any, res: any) => {
  const { id } = req.params;
  sectionsController.returnSection(req, res, id);
});

// Route updateSection
app.put('/sections/:id', pipe.updateSection, async (req: any, res: any) => {
  const { id } = req.params;
  const { newInitialGate, newFinalGate } = req.body;
  sectionsController.returnUpdateSection(req, res, id, newInitialGate, newFinalGate);
});

// Route deleteSection
app.delete('/sections/:id', pipe.deleteSection, async (req: any, res: any) => {
  const { id } = req.params;
  sectionsController.returnDeleteSection(req, res, id);
});

// Vehicles routes

// Get all vehicles

app.get('/vehicles', pipe.getAll, async (req: any, res: any) => {
  vehiclesController.returnAllVehicles(req, res);
});

// Get vehicles by type

app.get('/vehicles/:type', pipe.getVehicles, async (req: any, res: any) => {
  const { type } = req.params;
  vehiclesController.returnVehicle(req, res, type);
});

// Create a new vehicle

app.post('/vehicles', pipe.updateVehicle, async (req: any, res: any) => {
  const { type, limit } = req.body;
  vehiclesController.returnCreateVehicle(req, res, type, limit);
});

// Update a vehicle

app.put('/vehicles/:type', pipe.updateVehicle, async (req: any, res: any) => {
  const { type } = req.params;
  const { newLimit } = req.body;
  vehiclesController.returnUpdateVehicle(req, res, type, newLimit);
});

// Delete a vehicle

app.delete('/vehicles/:type', pipe.deleteVehicle, async (req: any, res: any) => {
  const { type } = req.params;
  vehiclesController.returnDeleteVehicle(req, res, type);
});

// Transits routes

// Get all transits

app.get('/transits', pipe.getAll, async (req: any, res: any) => {
  transitsController.returnAllTransits(req, res);
});

// Get a specific transit

app.get('/transits/:id', pipe.getTransit, async (req: any, res: any) => {
  const { id } = req.params;
  transitsController.returnTransit(req, res, id);
});

// Route to get all transits with plate "notFound" TODO check if the pipe works 
app.get('/notFoundTransits',async (req, res) => {
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

app.post('/transits', transitsMiddleware.sanitizeCreateTransitInputs, async (req, res) => {
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

app.put('/transits/:id', transitsMiddleware.sanitizeUpdateTransitInputs, async (req, res) => {
  const { id } = req.params;
  console.log(typeof (id));
  const { newPlate, newSpeed, newWeather, newVehicles_types, newGate } = req.body;

  try {
    // Convert id from string to number
    const transitId = parseInt(id, 10); // Use parseInt with base 10
    //const newDate = new Date(newTransit_date);
    console.log(typeof (transitId));
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
  const { plates, startDate, endDate, format } = req.body;

  // Converte plates in un array
  const platesArray = plates ? plates.split(', ') : [];

  try {
    const tickets = await ticketsModel.getTicketsByPlatesAndTime(platesArray, startDate, endDate, format, res);
    if (format === 'json') {
      if (tickets.length > 0) {
        res.status(200).json(tickets);
      } else {
        res.status(404).json({ error: 'Tickets not found' });
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Si è verificato un errore sconosciuto." });
    }
  }
});

// Statistics routes

// Get the most frequent gates

app.get('/frequentGates', async (req, res) => {
  try {
    const frequentGates = await ticketsModel.getFrequentGates();
    res.status(200).json(frequentGates);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred." });
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