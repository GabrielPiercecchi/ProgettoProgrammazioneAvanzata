import express from 'express';
import * as gatesController from './controllers/gatesController';
import * as sectionsController from './controllers/sectionsController';
import * as vehiclesController from './controllers/vehiclesController';
import * as transitsController from './controllers/transitsController';
import * as ticketsController from './controllers/ticketsController';
import * as usersController from './controllers/usersController';
import * as pipe from './middlewares/pipeline';

const app = express();

app.use(express.json());

// Open the server
app.listen(process.env.SERVICE_PORT, () => {
  console.log('Server is running on port ' + process.env.SERVICE_PORT);
});

// Users routes

// Route getAllUsers, no middleware
app.get('/users', async (req, res) => {
  usersController.returnAllUsers(req, res);
});

// Route getUser
app.get('/users/:username', pipe.getUser, async (req: any, res: any) => {
  const { username } = req.params;
  usersController.returnGetUser(req, res, username);
});

// Route createUser
app.post('/users', pipe.createUser, async (req: any, res: any) => {
  const { username } = req.body;
  usersController.returnCreateUser(req, res, username);
});

// Route updateUser
app.put('/users/:username', pipe.updateUser, async (req: any, res: any) => {
  const { username } = req.params;
  const { newUsername } = req.body;
  usersController.returnUpdateUser(req, res, username, newUsername);
});

// Route deleteUser
app.delete('/users/:username', pipe.deleteUser, async (req: any, res: any) => {
  const { username } = req.params;
  usersController.returnDeleteUser(req, res, username);
});

// Gates routes

// Route getAllGates
app.get('/gates', pipe.getAll, async (req: any, res: any) => {

  gatesController.returnAllGates(req, res);

});

// Route getGates
app.get('/gates/:id', pipe.getGate, async (req: any, res: any) => {
  const { id } = req.params;
  gatesController.returnGate(req, res, id);
});

// Route createGates
app.post('/gates', pipe.createGate, async (req: any, res: any) => {
  const { location, username } = req.body;

  gatesController.returnCreateGate(req, res, location, username);
});

//Route updateGates
app.put('/gates/:id', pipe.updateGate, async (req: any, res: any) => {
  const { id } = req.params;
  const { newUsername } = req.body;
  gatesController.returnUpdateGate(req, res, id, newUsername);
});

// Route deleteGates
app.delete('/gates/:id', pipe.deleteGate, async (req: any, res: any) => {
  const { id } = req.params;
  gatesController.returnDeleteGate(req, res, id);
});

// Section routes

// Route getAllSections
app.get('/sections', pipe.getAll, async (req: any, res: any) => {

  sectionsController.returAllSections(req, res);

});

// Route getSection
app.get('/sections/:id', pipe.getSection, async (req: any, res: any) => {
  const { id } = req.params;
  sectionsController.returnSection(req, res, id);
});

// Route createSection
app.post('/sections', pipe.createSection, async (req: any, res: any) => {
  const { initialGate, finalGate } = req.body;
  sectionsController.returnCreateSection(req, res, initialGate, finalGate);
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
app.post('/vehicles', pipe.createVehicle, async (req: any, res: any) => {
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
app.get('/notFoundTransits', async (req, res) => {
  transitsController.returnAllNotFoundTransits(req, res);
});

// Create a new transit
app.post('/transits', pipe.createTransit, async (req: any, res: any) => {
  const { plate, speed, weather, vehicles_types, gate } = req.body;
  transitsController.returnCreateTransit(req, res, plate, speed, weather, vehicles_types, gate);
});

// Update a transit
app.put('/transits/:id', pipe.updateTransit, async (req: any, res: any) => {
  const { id } = req.params;
  const { newPlate, newSpeed, newWeather, newVehicles_types, newGate } = req.body;
  transitsController.returnUpdateTransit(req, res, id, newPlate, newSpeed, newWeather, newVehicles_types, newGate);
});

// Delete a transit
app.delete('/transits/:id', pipe.deleteTransit, async (req: any, res: any) => {
  const { id } = req.params;
  transitsController.returnDeleteTransit(req, res, id);
});


// Ticket routes

// Get all tickets
app.get('/tickets', pipe.getAll, async (req: any, res: any) => {
  ticketsController.returnAllTickets(req, res);
});

// Get tickets by plates and time
app.post('/tickets', pipe.getTicket, async (req: any, res: any) => {
  const { plates, startDate, endDate, format } = req.body;

  // Converte plates in un array
  ticketsController.returnGetTickets(req, res, plates, startDate, endDate, format);
});

// Get stats by method
app.get('/stats/:method', pipe.getTicketStats, async (req: any, res: any) => {
  const { method } = req.params;
  const { startDate, endDate } = req.body;
  ticketsController.returnStats(req, res, method, startDate, endDate);
});
