'use strict';

const { parseCoordinateString, haversineDistance } = require('../other/distanceCalculator');
const { Section } = require('../models/sections'); // Assuming your model is located in 'models/Section.js'

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

      // // Insert into database using Sequelize model
      // await Section.create({
      //   initialGate: 1,
      //   finalGate: 2,
      //   distance: distance.toFixed(2) // in Km
      // });

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
    console.log('Down function not implemented for seed.');
  }
};
