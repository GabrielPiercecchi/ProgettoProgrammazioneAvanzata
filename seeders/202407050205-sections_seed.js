'use strict';

const { parseCoordinateString, haversineDistance } = require('../other/distanceCalculator');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Coordinate initialGate
    const initialGate = 'LAT43.615829LON13.518915';
    // Coordinate finalGate
    const finalGate = 'LAT44.494887LON11.342616';

    try {
      // Parse the coordinates
      const initialCoordinates = parseCoordinateString(initialGate);
      const finalCoordinates = parseCoordinateString(finalGate);

      // Calculate distance
      const distance = haversineDistance(initialCoordinates, finalCoordinates);

      await queryInterface.bulkInsert('sections', [
        {
          initialGate: 1,
          finalGate: 2,
          distance: distance.toFixed(2) // in Km
        }
      ], {});

      console.log('Seed executed successfully.');

    } catch (error) {
      console.error('Error executing seed:', error);
      throw new Error('Error executing seed.');
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('sections', null, {});
  }
};
