import { Request, Response } from 'express';
import Joi from 'joi';
import * as db from '../db';

// --- JOI VALIDATION SCHEMAS ---

const createIndividualSchema = Joi.object({
  tree_id: Joi.string().uuid().required(),
  first_name: Joi.string().min(1).max(100).required(),
  last_name: Joi.string().allow('', null),
  gender: Joi.string().valid('MALE', 'FEMALE', 'OTHER', 'UNKNOWN').required(),
  dob: Joi.date().allow(null),
  dod: Joi.date().allow(null),
  place_of_birth: Joi.string().allow(null),
  place_of_death: Joi.string().allow(null),
  rishta_type: Joi.string().allow(null, ''), // Custom field
  confidence_score: Joi.number().min(0).max(100).default(100),
  source_verification_url: Joi.string().uri().allow(null, ''),
  profile_image_url: Joi.string().uri().allow(null)
});

const updateIndividualSchema = Joi.object({
  first_name: Joi.string().min(1).max(100),
  last_name: Joi.string().allow('', null),
  gender: Joi.string().valid('MALE', 'FEMALE', 'OTHER', 'UNKNOWN'),
  dob: Joi.date().allow(null),
  dod: Joi.date().allow(null),
  place_of_birth: Joi.string().allow(null),
  place_of_death: Joi.string().allow(null),
  rishta_type: Joi.string().allow(null, ''),
  confidence_score: Joi.number().min(0).max(100),
  source_verification_url: Joi.string().uri().allow(null, ''),
  profile_image_url: Joi.string().uri().allow(null)
}).min(1); // At least one field must be present to update

// --- CONTROLLERS ---

/**
 * 1. CREATE Individual
 * POST /api/individual
 */
export const createIndividual = async (req: Request, res: Response) => {
  try {
    // Validate Input - Cast req to any to fix property 'body'
    const { error, value } = createIndividualSchema.validate((req as any).body);
    if (error) {
      // Cast res to any to fix property 'status'
      return (res as any).status(400).json({ success: false, error: error.details[0].message });
    }

    const {
      tree_id, first_name, last_name, gender, dob, dod,
      place_of_birth, place_of_death, rishta_type,
      confidence_score, source_verification_url, profile_image_url
    } = value;

    const sql = `
      INSERT INTO individuals (
        tree_id, first_name, last_name, gender, dob, dod, 
        place_of_birth, place_of_death, rishta_type, 
        confidence_score, source_verification_url, profile_image_url
      ) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *;
    `;

    const result = await db.query(sql, [
      tree_id, first_name, last_name, gender, dob, dod,
      place_of_birth, place_of_death, rishta_type,
      confidence_score, source_verification_url, profile_image_url
    ]);

    // Cast res to any to fix property 'status'
    return (res as any).status(201).json({
      success: true,
      message: "Individual created successfully",
      data: result.rows[0]
    });

  } catch (err: any) {
    console.error("Create Individual Error:", err);
    // Cast res to any to fix property 'status'
    return (res as any).status(500).json({ success: false, error: "Internal Server Error" });
  }
};

/**
 * 2. GET Individual Details
 * GET /api/individual/:id
 * Fetches profile + associated Media + Stories
 */
export const getIndividual = async (req: Request, res: Response) => {
  try {
    // Cast req to any to fix property 'params'
    const { id } = (req as any).params;

    // Fetch Basic Info
    const individualQuery = `SELECT * FROM individuals WHERE id = $1`;
    const individualResult = await db.query(individualQuery, [id]);

    if (individualResult.rows.length === 0) {
      // Cast res to any to fix property 'status'
      return (res as any).status(404).json({ success: false, error: "Individual not found" });
    }

    const individual = individualResult.rows[0];

    // Fetch Associated Media (Parallel Execution for Performance)
    const mediaQuery = `SELECT id, type, url, title FROM media WHERE individual_id = $1`;
    const storiesQuery = `SELECT id, title, content_preview, audio_url FROM stories WHERE individual_id = $1`;

    const [mediaRes, storiesRes] = await Promise.all([
      db.query(mediaQuery, [id]),
      db.query(storiesQuery, [id])
    ]);

    // Cast res to any to fix property 'status'
    return (res as any).status(200).json({
      success: true,
      data: {
        ...individual,
        media: mediaRes.rows,
        stories: storiesRes.rows
      }
    });

  } catch (err: any) {
    console.error("Get Individual Error:", err);
    // Cast res to any to fix property 'status'
    return (res as any).status(500).json({ success: false, error: "Internal Server Error" });
  }
};

/**
 * 3. UPDATE Individual
 * PUT /api/individual/:id
 * Dynamic update query generation
 */
export const updateIndividual = async (req: Request, res: Response) => {
  try {
    // Cast req to any to fix properties 'params' and 'body'
    const { id } = (req as any).params;

    // Validate Input
    const { error, value } = updateIndividualSchema.validate((req as any).body);
    if (error) {
      // Cast res to any to fix property 'status'
      return (res as any).status(400).json({ success: false, error: error.details[0].message });
    }

    // Dynamic SQL Generation
    // This allows us to update only the fields provided in the body
    const keys = Object.keys(value);
    const setClause = keys.map((key, index) => `${key} = $${index + 2}`).join(', ');
    const values = keys.map(key => value[key]);

    // Check if individual exists first (optional, but good for specific error messages)
    // Here we just use the result of the UPDATE query

    const sql = `
      UPDATE individuals 
      SET ${setClause}, updated_at = NOW()
      WHERE id = $1
      RETURNING *;
    `;

    const result = await db.query(sql, [id, ...values]);

    if (result.rows.length === 0) {
      // Cast res to any to fix property 'status'
      return (res as any).status(404).json({ success: false, error: "Individual not found" });
    }

    // Cast res to any to fix property 'status'
    return (res as any).status(200).json({
      success: true,
      message: "Individual updated successfully",
      data: result.rows[0]
    });

  } catch (err: any) {
    console.error("Update Individual Error:", err);
    // Cast res to any to fix property 'status'
    return (res as any).status(500).json({ success: false, error: "Internal Server Error" });
  }
};