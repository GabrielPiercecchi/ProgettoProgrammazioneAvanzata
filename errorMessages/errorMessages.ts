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
