import { DBIsConnected } from "../database/database";
import { Sequelize } from 'sequelize';
import { Section, getAllSections, getSections } from '../models/sections';
import * as distanceCalculator from '../other/distanceCalculator';
import { Gate } from "../models/gates";
import { ErrorMessagesSectionController } from "../messages/errorMessages";

const SALT_ROUNDS = 10;

//Connection to DataBase
const sequelize: Sequelize = DBIsConnected.getInstance(); // we dont need it i think @FRANCESCO

// CREATE Section
export async function createSection(initialGate: number, finalGate: number): Promise<any> {
  let initialGateDB: any;
  let finalGateDB: any;
  try {
    initialGateDB = await Gate.findByPk(initialGate);
    finalGateDB = await Gate.findByPk(finalGate);
    const coord1 = distanceCalculator.parseCoordinateString(initialGateDB.location);
    const coord2 = distanceCalculator.parseCoordinateString(finalGateDB.location);
    const distance = distanceCalculator.haversineDistance(coord1, coord2);
    // Creare la nuova sezione
    const newSection = await Section.create({
      initialGate,
      finalGate,
      distance
    });
    return newSection;
  } catch (error) {
    if (error instanceof Error) {
      console.error(ErrorMessagesSectionController.creationError, error.message);
      throw new Error(`${ErrorMessagesSectionController.creationError} ${error.message}`);
    } else {
      console.error(ErrorMessagesSectionController.unknownCreationError, error);
      throw new Error(`${ErrorMessagesSectionController.unknownCreationError} ${error}`);
    }
  }
}

/**
 * UPDATE Section
 * @param InitialGate value for initialGate
 * @param FinalGate value for finalGate
 * @param newInitialGate New value for initialGate
 * @param newFinalGate New value for finalGate
 * @returns Updated Section object
 */
export async function updateSection(sectionId: number, newInitialGate: number, newFinalGate: number): Promise<any> {
  let result: any;
  let initialGate: any;
  let finalGate: any;
  try {
    result = await Section.findByPk(sectionId);
    if (result) {
      // Aggiorna i campi initialGate e finalGate con i nuovi valori
      result.initialGate = newInitialGate;
      result.finalGate = newFinalGate;
      initialGate = await Gate.findByPk(newInitialGate);
      finalGate = await Gate.findByPk(newFinalGate);
      const coord1 = distanceCalculator.parseCoordinateString(initialGate.location);
      const coord2 = distanceCalculator.parseCoordinateString(finalGate.location);
      const distance = distanceCalculator.haversineDistance(coord1, coord2);
      result.distance = distance;
      await result.save();
      return result;
    } else {
      throw new Error(`${ErrorMessagesSectionController.sectionNotFound} ${sectionId}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(ErrorMessagesSectionController.updatingError, error.message);
      throw new Error(`${ErrorMessagesSectionController.updatingError} ${error.message}`);
    } else {
      console.error(ErrorMessagesSectionController.unknownUpdatingError, error);
      throw new Error(`${ErrorMessagesSectionController.unknownUpdatingError} ${error}`);
    }
  }
}

/**
 * DELETE Section
 * @param sectionId ID of the Section to delete
 * @returns Success message if deletion is successful
 */
export async function deleteSection(sectionId: number): Promise<string> {
  try {
    // Find the Section based on its primary key (ID)
    const result = await Section.findByPk(sectionId);

    if (result) {
      await result.destroy();
      return `Section with ID ${sectionId} was deleted successfully.`;
    } else {
      throw new Error(`${ErrorMessagesSectionController.sectionNotFound} ${sectionId}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(ErrorMessagesSectionController.deletionError, error.message);
      throw new Error(`${ErrorMessagesSectionController.deletionError} ${error.message}`);
    } else {
      console.error(ErrorMessagesSectionController.unknownDeletionError, error);
      throw new Error(`${ErrorMessagesSectionController.unknownDeletionError} ${error}`);
    }
  }
}

export async function returAllSections(req: any, res: any) {
  try {
    const sections = await getAllSections();
    res.status(200).json(sections);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: ErrorMessagesSectionController.unknownError });
    }
  }
}

export async function returnSection(req: any, res: any, id: string) {
  try {
    // Convert id from string to number using parseInt with base 10
    const sectionId = parseInt(id, 10);

    const section = await getSections(sectionId);
    if (section) {
      res.status(200).json(section);
    } else {
      res.status(404).json({ error: ErrorMessagesSectionController.sectionNotFound });
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: ErrorMessagesSectionController.unknownError });
    }
  }
}

export async function returnCreateSection(req: any, res: any, initialGate: number, finalGate: number) {
  try {
    const newSection = await createSection(initialGate, finalGate);
    res.status(201).json(newSection);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: ErrorMessagesSectionController.unknownError });
    }
  }
}

export async function returnUpdateSection(req: any, res: any, id: string, newInitialGate: number, newFinalGate: number) {
  try {
    // Convert id from string to number using parseInt with base 10
    const sectionId = parseInt(id, 10);

    const updatedSection = await updateSection(sectionId, newInitialGate, newFinalGate);
    if (updatedSection) {
      res.status(200).json(updatedSection);
    } else {
      res.status(404).json({ error: ErrorMessagesSectionController.sectionNotFound });
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: ErrorMessagesSectionController.unknownError });
    }
  }
}

export async function returnDeleteSection(req: any, res: any, id: string) {
  try {
    // Convert id from string to number using parseInt with base 10
    const sectionId = parseInt(id, 10);

    const result = await deleteSection(sectionId);
    res.status(200).json(result);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: ErrorMessagesSectionController.unknownError });
    }
  }
}