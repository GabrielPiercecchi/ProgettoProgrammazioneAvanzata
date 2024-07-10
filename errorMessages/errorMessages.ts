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
export const VehicleMiddlewareErrors = {
    invalidTypeFormat: 'Invalid type format. Expected format: String',
    typeNotNullOrEmpty: 'Type cannot be null or undefined.',
    limitNotNullOrEmpty: 'Limit cannot be null or undefined.'
};


export const ErrorMessagesGateController = {
    USER_NOT_FOUND: 'User does not exist in Users. You have to create it first',
    GATE_NOT_FOUND: 'Gate not found.',
    GATE_CREATION_ERROR: 'Error during Gate creation in the database:',
    GATE_UPDATING_ERROR: 'Error during Gate updating in the database:',
    GATE_DELETION_ERROR: 'Error during Gate deletion in the database:',
    UNKNOWN_ERROR: 'Unknown error in the database.'
};
