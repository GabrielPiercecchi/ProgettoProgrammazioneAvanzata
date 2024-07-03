interface Coordinates {
    degrees: number;
    minutes: number;
    seconds: number;
    direction: 'N' | 'S' | 'E' | 'W';
}

export function parseCoordinateString(coordinateString: string): Coordinates {
    const regex = /(\d+)°\s+(\d+)'(?:\s+([\d.]+)")?\s+([NSEW])/;
    const match = coordinateString.match(regex);
    if (!match) {
        throw new Error('Invalid coordinate format');
    }

    return {
        degrees: parseInt(match[1], 10),
        minutes: parseInt(match[2], 10),
        seconds: parseFloat(match[3] || '0'),
        direction: match[4] as 'N' | 'S' | 'E' | 'W'
    };
}

export function convertToDecimalDegrees(coordinate: Coordinates): number {
    const { degrees, minutes, seconds, direction } = coordinate;
    let decimalDegrees = degrees + minutes / 60 + seconds / 3600;
    if (direction === 'S' || direction === 'W') {
        decimalDegrees = -decimalDegrees;
    }
    return decimalDegrees;
}

export function haversineDistance(coord1: Coordinates, coord2: Coordinates): number {
    const lat1 = convertToDecimalDegrees(coord1);
    const lon1 = convertToDecimalDegrees(coord2);
    const lat2 = convertToDecimalDegrees(coord1);
    const lon2 = convertToDecimalDegrees(coord2);

    const R = 6371; // Raggio della Terra in chilometri
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);

    const a = Math.sin(dLat / 2) ** 2 +
              Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
              Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distanza in chilometri
}
