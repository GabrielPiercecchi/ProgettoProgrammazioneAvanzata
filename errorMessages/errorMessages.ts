//User errors

// user model errors
export const ErrorMessagesUserModel = {
    fetchError: 'Error during Users fetch in the database:',
    unknownFetchError: 'Unknown error during Users fetch in the database.'
};

// user controller errors
export const ErrorMessagesUserController = {
    createUser: 'Error during User creation in the database.',
    deleteUser: 'Error during User deletion in the database.',
    updateUser: 'Error during User updating in the database.',
    unknownError: 'An unknown error occurred.',
    userNotFound: 'User not found.',
    notUserGate: 'The user is not a gate. You can delete only gates'
};


// user middleware errors
export const UserMiddlewareErrors = {
    invalidUsernameFormat: 'Invalid username format. Expected format: String',
    usernameNotNullOrEmpty: 'Username cannot be null or undefined.',
    usernameNewUsernameNotNullOrEmpty: 'Username and newUsername cannot be null or undefined.'
};

// Vehicle errors

// vehicle model errors
export const ErrorMessagesVehicleModel = {
    fetchError: 'Error during Vehicles fetch in the database:',
    unknownFetchError: 'Unknown error during Vehicles fetch in the database.'
};

// Vehicle controller errors
export const ErrorMessagesVehicleController = {
    createVehicle: 'Error during Vehicle creation in the database.',
    deleteVehicle: 'Error during Vehicle deletion in the database.',
    updateVehicle: 'Error during Vehicle update in the database.',
    fetchVehicles: 'Error fetching vehicles from the database.',
    unknownError: 'An unknown error occurred.',
    vehicleNotFound: 'Vehicle not found.',
    alreadyExists: 'Vehicle with this type already exists.'
};

// Vehicle middleware errors
export const ErrorMessagesVehicleMiddleware = {
    typeNotNullOrEmpty: 'Type cannot be null or undefined.',
    limitNotNullOrEmpty: 'Limit cannot be null or undefined.',
    invalidTypeFormat: 'Invalid Type format. Type must start with a letter and without special characters.',
    invalidSpeedLimit: 'Invalid speed limit. Speed limit must be an integer between 30 and 150.',
    typeAndLimitNotNullOrEmpty: 'Type and limit cannot be null or undefined.',
    newLimitNotNullOrEmpty: 'New limit cannot be null or undefined.'
};

// Gate errors

// gate model errors
export const ErrorMessagesGateModel = {
    fetchError: 'Error during Gate fetch in the database:',
    unknownFetchError: 'Unknown error during Gate fetch in the database.'
};

// gate controller errors
export const ErrorMessagesGateController = {
    creationError: 'Error during Gate creation in the database:',
    updatingError: 'Error during Gate updating in the database:',
    deletionError: 'Error during Gate deletion in the database:',
    fetchError: 'Error during Gate fetch in the database:',
    unknownCreationError: 'Unknown error during Gate creation in the database.',
    unknownUpdatingError: 'Unknown error during Gate updating in the database.',
    unknownDeletionError: 'Unknown error during Gate deletion in the database.',
    unknownFetchError: 'Unknown error during Gate fetch in the database.',
    userNotFound: 'User does not exist in Users. You have to create it first.',
    gateNotFound: 'Gate not found.',
    unknownError: 'An unknown error occurred.'
};

// gate middleware errors
export const ErrorMessagesGateMIddleware = {
    invalidIdFormat: 'Invalid id format. Expected format: Number > 0',
    locationNotNull: 'Location, username, and password cannot be null or undefined.',
    invalidLocationFormat: 'Invalid location format. Expected format: LAT43.615829LON13.518915',
    invalidUsernameFormat: 'Invalid username format. Username must start with a letter and without special characters.',
    newUsernameNotNull: 'New username cannot be null or undefined.',
    locationNotNullOrUndefined: 'Location cannot be null or undefined.',
};

// Ticket errors

// ticket model errors
export const ErrorMessagesTicketModel = {
    fetchingError: 'Error during Tickets fetching in the database:',
    notFound: 'Tickets not found',
    unknownFetchingError: 'Unknown error during Tickets fetching in the database.',
    frequentGatePairsFetchingError: 'Error fetching frequent gate pairs from the database:',
    frequentGetMinMaxSpeed: 'Error fetching max and min medium_speed from the database:',
    unknownFrequentGetMinMaxSpeed: 'Unknown max and min medium_speed from the database.',
    unknownFrequentGatePairsFetchingError: 'Unknown error fetching frequent gate pairs from the database.',
};

// ticket controller errors
export const ErrorMessagesTicketController = {
    fetchingError: 'Error during Tickets fetching in the database: ',
    updatingError: 'Error during Tickets updating in the database: ',
    notFound: 'Tickets not found',
    unknownError: 'An unknown error occurred.',
    invalidMethod: 'Invalid method specified: must be either "getFrequentGates" or "getMinMaxSpeed".',
    platesNotAssigned: 'Some plates are not assigned to the driver',
};

// ticket middleware errors
export const ErrorMessagesTicketMiddleware = {
    invalidPlatesFormat: 'Invalid plates format: expected AA123AA. Plates must be separated by a comma and a single space if there are multiple plates.',
    invalidPlateFormat: 'Invalid plate format: Expected format: 2 letters, 3 numbers, 2 letters.',
    platesNotNullOrUndefined: 'Plates cannot be null or undefined.',
    invalidStartDateFormat: 'Invalid start date format: Expected format: YYYY-MM-DDTHH:MM:SS.',
    invalidEndDateFormat: 'Invalid end date format: Expected format: YYYY-MM-DDTHH:MM:SS.',
    invalidFormat: 'Invalid format. Format must be either "json" or "pdf".',
    methodNotNullOrEmpty: 'Method cannot be null or undefined.',
    startDateNotNullOrEmpty: 'Start date cannot be null or undefined.',
    endDateNotNullOrEmpty: 'End date cannot be null or undefined.',
    invalidMethod: 'Invalid method. Method must be either "getFrequentGates" or "getMinMaxSpeed".'
};

// Transit errors

// transit model errors
export const ErrorMessagesTransitModel = {
    fetchError: 'Error during Transit fetch in the database:',
    unknownFetchError: 'Unknown error during Transit fetch in the database.',
    notFound: 'No Transits found with plate "notFound"'
}

// transit controller errors
export const ErrorMessagesTransitController = {
    creationError: 'Error during Transit creation in the database:',
    updatingError: 'Error during Transit updating in the database:',
    deletionError: 'Error during Transit deletion in the database:',
    fetchError: 'Error during Transit fetch in the database:',
    unknownCreationError: 'Unknown error during Transit creation in the database.',
    unknownUpdatingError: 'Unknown error during Transit updating in the database.',
    unknownDeletionError: 'Unknown error during Transit deletion in the database.',
    unknownFetchError: 'Unknown error during Transit fetch in the database.',
    transitNotFound: 'Transit not found.',
    unknownError: 'An unknown error occurred.',
    notFound: 'No Transits found with plate "notFound"'
};

// transit middleware errors
export const ErrorMessagesTransitMiddleware = {
    invalidPlateFormat: 'Invalid plate format. Expected format: 2 letters, 3 numbers, 2 letters.',
    invalidSpeedFormat: 'Invalid speed format. Expected format: Number > 0.',
    invalidWeatherFormat: 'Invalid weather format. Expected format: String',
    invalidVehiclesTypesFormat: 'Invalid vehicles_types format. Expected format: String',
    invalidGateFormat: 'Invalid gate format. Expected format: Number > 0',
    plateNotNullOrEmpty: 'Plate cannot be null or undefined.',
    speedNotNullOrEmpty: 'Speed cannot be null or undefined.',
    weatherNotNullOrEmpty: 'Weather cannot be null or undefined.',
    vehiclesTypesNotNullOrEmpty: 'Vehicles_types cannot be null or undefined.',
    gateNotNullOrEmpty: 'Gate cannot be null or undefined.',
    plateSpeedWeatherVehiclesTypesGateNotNullOrEmpty: 'Plate, speed, weather, vehicles_types, and gate cannot be null or undefined.',
    newPlateSpeedWeatherVehiclesTypesGateNotNullOrEmpty: 'Plate, speed, weather, vehicles_types, and gate cannot be null or undefined.',
    invalidId: 'Invalid id. Id must be an integer.',
};