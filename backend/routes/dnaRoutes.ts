import { Router, Request, Response, NextFunction } from 'express';
import { uploadDnaData, upload } from '../controllers/dnaController';

const router = Router();

// Mock Authentication Middleware (Replace with actual JWT verify)
const protect = (req: Request, res: Response, next: NextFunction) => {
  // Cast req to any to fix property 'headers'
  const authHeader = (req as any).headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    // Verify token here
    next();
  } else {
    // Cast res to any to fix property 'status'
    (res as any).status(401).json({ error: 'Not authorized' });
  }
};

/**
 * @route POST /api/dna/upload
 * @desc Securely upload and encrypt Raw DNA Data
 * @access Private
 */
router.post('/upload', protect, upload.single('dna_file'), uploadDnaData);

export default router;