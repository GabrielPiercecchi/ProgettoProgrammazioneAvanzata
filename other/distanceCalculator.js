"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseCoordinateString = parseCoordinateString;
exports.haversineDistance = haversineDistance;
function parseCoordinateString(coordinateString) {
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
function haversineDistance(coord1, coord2) {
    const { latitude: lat1, longitude: lon1 } = coord1;
    const { latitude: lat2, longitude: lon2 } = coord2;
    const R = 6371; // Raggio della Terra in chilometri
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distanza in chilometri
    return parseFloat(distance.toFixed(2)); // Ritorna la distanza come numero con due cifre decimali
}
/*
// Esempio di utilizzo
const coordString1 = 'LAT43.6158299LON13.518915';
const coordString2 = 'LAT44.494887LON11.3426163';

const coord1 = parseCoordinateString(coordString1);
const coord2 = parseCoordinateString(coordString2);

console.log(`Distanza: ${haversineDistance(coord1, coord2)} km`);
*/
module.exports = {
    parseCoordinateString,
    haversineDistance
};
