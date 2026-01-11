import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import crypto from 'crypto';
import path from 'path';
import { Buffer } from 'buffer';
import * as db from '../db';

// --- CONFIGURATION ---
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
  }
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME;
const ENCRYPTION_KEY = Buffer.from(process.env.DNA_ENCRYPTION_KEY || '', 'hex'); // Must be 32 bytes
const IV_LENGTH = 16; // For AES-GCM

// --- MULTER SETUP (File Filtering) ---
const storage = multer.memoryStorage(); // We need the buffer to encrypt it

const fileFilter = (req: Request, file: any, cb: multer.FileFilterCallback) => {
  const allowedMimeTypes = ['text/csv', 'text/plain', 'application/vnd.ms-excel']; // CSVs sometimes show as excel
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedMimeTypes.includes(file.mimetype) && (ext === '.csv' || ext === '.txt')) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only Raw DNA Data in .csv or .txt formats are accepted.'));
  }
};

export const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit for raw DNA files
});

// --- HELPER: ENCRYPTION ---
const encryptBuffer = (buffer: Buffer): Buffer => {
  if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length !== 32) {
    throw new Error("Invalid Encryption Key. Must be 32 bytes hex.");
  }
  
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-gcm', ENCRYPTION_KEY, iv);
  
  const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
  const authTag = cipher.getAuthTag();
  
  // Return format: IV + AuthTag + EncryptedData (Required for decryption)
  return Buffer.concat([iv, authTag, encrypted]);
};

// --- CONTROLLER ---
export const uploadDnaData = async (req: Request, res: Response) => {
  try {
    // Cast req to any to fix properties 'file' and 'body'
    const file = (req as any).file;
    const { memberId } = (req as any).body; // The family member this DNA belongs to

    // 1. Validation
    if (!file) {
      // Cast res to any to fix property 'status'
      return (res as any).status(400).json({ error: "No file provided." });
    }
    if (!memberId) {
      // Cast res to any to fix property 'status'
      return (res as any).status(400).json({ error: "Member ID is required." });
    }

    console.log(`Processing DNA upload for: ${file.originalname}`);

    // 2. Encrypt the Data (Security Layer)
    // We encrypt BEFORE sending to S3. Even AWS cannot read this data without your key.
    const encryptedBuffer = encryptBuffer(file.buffer);

    // 3. Generate Secure S3 Key
    const fileKey = `dna-records/${memberId}/${Date.now()}-${crypto.randomBytes(8).toString('hex')}.enc`;

    // 4. Upload to S3
    const uploadParams = {
      Bucket: BUCKET_NAME,
      Key: fileKey,
      Body: encryptedBuffer,
      ContentType: 'application/octet-stream', // Binary data now
      Metadata: {
        originalName: file.originalname,
        uploadedAt: new Date().toISOString()
      }
    };

    await s3Client.send(new PutObjectCommand(uploadParams));

    // 5. Link to Profile in DB
    const sql = `
      INSERT INTO dna_kits (member_id, s3_key, original_filename, uploaded_at)
      VALUES ($1, $2, $3, NOW())
      RETURNING id, uploaded_at;
    `;
    
    const result = await db.query(sql, [memberId, fileKey, file.originalname]);

    // 6. Success Response
    // Cast res to any to fix property 'status'
    return (res as any).status(200).json({
      success: true,
      message: "DNA Data securely encrypted and stored.",
      data: {
        kitId: result.rows[0].id,
        fileName: file.originalname,
        status: "ENCRYPTED_AT_REST"
      }
    });

  } catch (error: any) {
    console.error("DNA Upload Error:", error);
    // Cast res to any to fix property 'status'
    return (res as any).status(500).json({ 
      error: "Upload Failed", 
      message: "An error occurred while securing your data. Please try again." 
    });
  }
};