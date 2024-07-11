interface Coordinates {
    latitude: number;
    longitude: number;
}

/**
 * Parses a coordinate string into an object containing latitude and longitude.
 * @param coordinateString - The coordinate string in the format "LATxx.xxxxxxLONxx.xxxxxx".
 * @returns An object with latitude and longitude.
 * @throws Will throw an error if the coordinate string format is invalid.
 */
export function parseCoordinateString(coordinateString: string): Coordinates {
    const regex = /LAT(-?\d+\.\d+)LON(-?\d+\.\d+)/;
    const match = coordinateString.match(regex);
    if (!match) {
        throw new Error('Invalid coordinate format');
    }

    return {
        latitude: parseFloat(match[1]),
        longitude: parseFloat(match[2]),
    };
}

/**
 * Calculates the Haversine distance between two sets of coordinates.
 * @param coord1 - The first set of coordinates.
 * @param coord2 - The second set of coordinates.
 * @returns The distance in kilometers, rounded to two decimal places.
 */
export function haversineDistance(coord1: Coordinates, coord2: Coordinates): number {
    const { latitude: lat1, longitude: lon1 } = coord1;
    const { latitude: lat2, longitude: lon2 } = coord2;

    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);

    const a = Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c; // Distance in kilometers
    return parseFloat(distance.toFixed(2)); // Returns the distance as a number with two decimal places
}
