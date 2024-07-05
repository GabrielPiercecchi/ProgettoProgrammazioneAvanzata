'use strict';

//const { Sequelize } = require("sequelize");
const { parseCoordinateString, convertToDecimalDegrees, haversineDistance } = require('../other/distanceCalculator');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Coordinate initialGate
    const initialGate = '40°33′03.2″N 14°14′33.36″E';
    // Coordinate finalGate
    const finalGate = '40°33′02.0″N 14°14′34.0″E';

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