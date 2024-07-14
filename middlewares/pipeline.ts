import * as authMiddleware from './authMiddleware';
import * as gatesMiddleware from './gatesMiddleware';
import * as sectionsMiddleware from './sectionsMiddleware';
import * as ticketsMiddleware from './ticketsMiddleware';
import * as transitsMiddleware from './transitsMiddleware';
import * as vehiclesMiddleware from './vehiclesMiddleware';
import * as usersMiddleware from './usersMiddleware';

// Chain of Responsibility for different routes and operations

// Middleware chain for retrieving all resources
export const getAll = [
    authMiddleware.authentication, // Ensure user is authenticated
    authMiddleware.checkOperator, // Check if user is an operator
];

// Middleware chain for retrieving a specific user
export const getUser = [
    authMiddleware.authentication, // Ensure user is authenticated
    authMiddleware.checkOperator, // Check if user is an operator
    usersMiddleware.sanitizeGetGateUserInputs, // Sanitize inputs specific to getting a user
];

// Middleware chain for creating a user
export const createUser = [
    authMiddleware.authentication, // Ensure user is authenticated
    authMiddleware.checkOperator, // Check if user is an operator
    usersMiddleware.sanitizeCreateGateUserInputs, // Sanitize inputs specific to creating a user
];

// Middleware chain for updating a user
export const updateUser = [
    authMiddleware.authentication, // Ensure user is authenticated
    authMiddleware.checkOperator, // Check if user is an operator
    usersMiddleware.sanitizeUpdateGateUserInputs, // Sanitize inputs specific to updating a user
];

// Middleware chain for deleting a user
export const deleteUser = [
    authMiddleware.authentication, // Ensure user is authenticated
    authMiddleware.checkOperator, // Check if user is an operator
    usersMiddleware.sanitizeDeleteGateUserInputs, // Sanitize inputs specific to deleting a user
];

// Middleware chain for retrieving a specific gate
export const getGate = [
    authMiddleware.authentication, // Ensure user is authenticated
    authMiddleware.checkOperator, // Check if user is an operator
    gatesMiddleware.sanitizeGetGateInputs, // Sanitize inputs specific to getting a gate
];

// Middleware chain for creating a gate
export const createGate = [
    authMiddleware.authentication, // Ensure user is authenticated
    authMiddleware.checkOperator, // Check if user is an operator
    gatesMiddleware.sanitizeCreateGateInputs, // Sanitize inputs specific to creating a gate
];

// Middleware chain for updating a gate
export const updateGate = [
    authMiddleware.authentication, // Ensure user is authenticated
    authMiddleware.checkOperator, // Check if user is an operator
    gatesMiddleware.sanitizeUpdateGateInputs, // Sanitize inputs specific to updating a gate
];

// Middleware chain for deleting a gate
export const deleteGate = [
    authMiddleware.authentication, // Ensure user is authenticated
    authMiddleware.checkOperator, // Check if user is an operator
    gatesMiddleware.sanitizeDeleteGateInputs, // Sanitize inputs specific to deleting a gate
];

// Middleware chain for retrieving a specific section
export const getSection = [
    authMiddleware.authentication, // Ensure user is authenticated
    authMiddleware.checkOperator, // Check if user is an operator
    sectionsMiddleware.sanitizeGetSectionInputs, // Sanitize inputs specific to getting a section
];

// Middleware chain for creating a section
export const createSection = [
    authMiddleware.authentication, // Ensure user is authenticated
    authMiddleware.checkOperator, // Check if user is an operator
    sectionsMiddleware.sanitizeCreateSectionInputs, // Sanitize inputs specific to creating a section
];

// Middleware chain for updating a section
export const updateSection = [
    authMiddleware.authentication, // Ensure user is authenticated
    authMiddleware.checkOperator, // Check if user is an operator
    sectionsMiddleware.sanitizeUpdateSectionInputs, // Sanitize inputs specific to updating a section
];

// Middleware chain for deleting a section
export const deleteSection = [
    authMiddleware.authentication, // Ensure user is authenticated
    authMiddleware.checkOperator, // Check if user is an operator
    sectionsMiddleware.sanitizeDeleteSectionInputs, // Sanitize inputs specific to deleting a section
];

// Middleware chain for retrieving vehicles
export const getVehicles = [
    authMiddleware.authentication, // Ensure user is authenticated
    authMiddleware.checkOperator, // Check if user is an operator
    vehiclesMiddleware.sanitizeGetVehicleInputs, // Sanitize inputs specific to getting vehicles
];

// Middleware chain for creating a vehicle
export const createVehicle = [
    authMiddleware.authentication, // Ensure user is authenticated
    authMiddleware.checkOperator, // Check if user is an operator
    vehiclesMiddleware.sanitizeCreateVehicleInputs, // Sanitize inputs specific to creating a vehicle
];

// Middleware chain for updating a vehicle
export const updateVehicle = [
    authMiddleware.authentication, // Ensure user is authenticated
    authMiddleware.checkOperator, // Check if user is an operator
    vehiclesMiddleware.sanitizeUpdateVehicleInputs, // Sanitize inputs specific to updating a vehicle
];

// Middleware chain for deleting a vehicle
export const deleteVehicle = [
    authMiddleware.authentication, // Ensure user is authenticated
    authMiddleware.checkOperator, // Check if user is an operator
    vehiclesMiddleware.sanitizeDeleteVehicleInputs, // Sanitize inputs specific to deleting a vehicle
];

// Middleware chain for retrieving a transit
export const getTransit = [
    authMiddleware.authentication, // Ensure user is authenticated
    authMiddleware.checkOperator, // Check if user is an operator
    transitsMiddleware.sanitizeGetTransitInputs, // Sanitize inputs specific to getting a transit
];

// Middleware chain for creating a transit
export const createTransit = [
    authMiddleware.authentication, // Ensure user is authenticated
    authMiddleware.checkOperatororGates, // Check if user is an operator or gates
    transitsMiddleware.sanitizeCreateTransitInputs, // Sanitize inputs specific to creating a transit
];

// Middleware chain for updating a transit
export const updateTransit = [
    authMiddleware.authentication, // Ensure user is authenticated
    authMiddleware.checkOperator, // Check if user is an operator
    transitsMiddleware.sanitizeUpdateTransitInputs, // Sanitize inputs specific to updating a transit
];

// Middleware chain for deleting a transit
export const deleteTransit = [
    authMiddleware.authentication, // Ensure user is authenticated
    authMiddleware.checkOperator, // Check if user is an operator
    transitsMiddleware.sanitizeDeleteTransitInputs, // Sanitize inputs specific to deleting a transit
];

// Middleware chain for retrieving tickets
export const getTicket = [
    authMiddleware.authentication, // Ensure user is authenticated
    authMiddleware.checkOperatorDriver, // Check if user is an operator or driver
    ticketsMiddleware.sanitizeGetTicketsInputs, // Sanitize inputs specific to getting tickets
];

// Middleware chain for ticket Stats
export const getTicketStats = [
    authMiddleware.authentication, // Ensure user is authenticated
    authMiddleware.checkOperator, // Check if user is an operator
    ticketsMiddleware.sanitizePostStatisticsInputs, // Sanitize inputs specific to getting ticket stats
];

