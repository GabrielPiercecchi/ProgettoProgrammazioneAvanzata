import * as authMiddleware from './authMiddleware';
import * as gatesMiddleware from './gatesMiddleware';
import * as sectionsMiddleware from './sectionsMiddleware';
import * as ticketsMiddleware from './ticketsMiddleware';
import * as transitsMiddleware from './transitsMiddleware';
import * as vehiclesMiddleware from './vehiclesMiddleware';


// chain of responsibility

export const getAll = [
    authMiddleware.authentication,
    authMiddleware.checkOperator,
]

export const getGate = [
    authMiddleware.authentication,
    authMiddleware.checkOperator,
    gatesMiddleware.sanitizeGetGateInputs,
]

export const createGate = [
    authMiddleware.authentication,
    authMiddleware.checkOperator,
    gatesMiddleware.sanitizeCreateGateInputs,
]

export const updateGate = [
    authMiddleware.authentication,
    authMiddleware.checkOperator,
    gatesMiddleware.sanitizeUpdateGateInputs,
]

export const deleteGate = [
    authMiddleware.authentication,
    authMiddleware.checkOperator,
    gatesMiddleware.sanitizeDeleteGateInputs,
]
export const getSection = [
    authMiddleware.authentication,
    authMiddleware.checkOperator,
    sectionsMiddleware.sanitizeGetSectionInputs,
]

export const createSection = [
    authMiddleware.authentication,
    authMiddleware.checkOperator,
    sectionsMiddleware.sanitizeCreateSectionInputs,
]

export const updateSection = [
    authMiddleware.authentication,
    authMiddleware.checkOperator,
    sectionsMiddleware.sanitizeUpdateSectionInputs,
]

export const deleteSection = [
    authMiddleware.authentication,
    authMiddleware.checkOperator,
    sectionsMiddleware.sanitizeDeleteSectionInputs,
]

export const getVehicles = [
    authMiddleware.authentication,
    authMiddleware.checkOperator,
    vehiclesMiddleware.sanitizeGetVehicleInputs,
]

export const createVehicle = [
    authMiddleware.authentication,
    authMiddleware.checkOperator,
    vehiclesMiddleware.sanitizeCreateVehicleInputs,
]

export const updateVehicle = [
    authMiddleware.authentication,
    authMiddleware.checkOperator,
    vehiclesMiddleware.sanitizeUpdateVehicleInputs,
]

export const deleteVehicle = [
    authMiddleware.authentication,
    authMiddleware.checkOperator,
    vehiclesMiddleware.sanitizeDeleteVehicleInputs,
]

export const getTransit = [
    authMiddleware.authentication,
    authMiddleware.checkOperator,
    transitsMiddleware.sanitizeGetTransitInputs,
]

export const createTransit = [
    authMiddleware.authentication,
    authMiddleware.checkOperatororGates,
    transitsMiddleware.sanitizeCreateTransitInputs,
]

export const updateTransit = [
    authMiddleware.authentication,
    authMiddleware.checkOperator,
    transitsMiddleware.sanitizeUpdateTransitInputs,
]

export const deleteTransit = [
    authMiddleware.authentication,
    authMiddleware.checkOperator,
    transitsMiddleware.sanitizeDeleteTransitInputs,
]

export const getTicket = [
    authMiddleware.authentication,
    authMiddleware.checkOperatorDriver,
    ticketsMiddleware.sanitizeGetTicketsInputs,
]

