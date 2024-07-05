'use strict';

//const { Sequelize } = require("sequelize");
const { parseCoordinateString, convertToDecimalDegrees, haversineDistance } = require('../other/distanceCalculator');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Coordinate initialGate
    const initialGate = 'LAT43.6158299LON13.518915';
    // Coordinate finalGate
    const finalGate = 'LAT44.494887LON11.3426163';

    // Parse the coordinates
    const initialCoordinates = parseCoordinateString(initialGate);
    const finalCoordinates = parseCoordinateString(finalGate);

    // Calcola la distanza
    const distance = haversineDistance(initialCoordinates, finalCoordinates);

    await queryInterface.bulkInsert('sections', [
      {
        initialGate: initialGate,
        finalGate: finalGate,
        distance: distance.toFixed(2) // in Km
      },
    ]);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('sequelize', null, {});
  }
};