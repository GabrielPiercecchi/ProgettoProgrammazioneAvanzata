'use strict';

const { parseCoordinateString, haversineDistance } = require('../other/distanceCalculator');
const { Section } = require('../models/sections'); // Assuming your model is located in 'models/Section.js'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Coordinate initialGate
    const initialGate = 'LAT43.6158299LON13.518915';
    // Coordinate finalGate
    const finalGate = 'LAT44.494887LON11.3426163';

    try {
      // Parse the coordinates
      const initialCoordinates = parseCoordinateString(initialGate);
      const finalCoordinates = parseCoordinateString(finalGate);

      // Calculate distance
      const distance = haversineDistance(initialCoordinates, finalCoordinates);

      // Insert into database using Sequelize model
      await Section.create({
        initialGate: initialGate,
        finalGate: finalGate,
        distance: distance.toFixed(2) // in Km
      });

      console.log('Seed executed successfully.');

    } catch (error) {
      console.error('Error executing seed:', error);
      throw new Error('Error executing seed.');
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Since Sequelize is managing migrations, down function is usually unnecessary for seeds
    // If needed, you would typically delete the inserted record(s) here
    // For example:
    // await Section.destroy({ where: { initialGate: 'LAT43.6158299LON13.518915', finalGate: 'LAT44.494887LON11.3426163' } });
    
    console.log('Down function not implemented for seed.');
  }
};
