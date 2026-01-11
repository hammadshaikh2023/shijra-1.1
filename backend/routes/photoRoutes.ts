import { Router, Request, Response, NextFunction } from 'express';
import { animatePhoto, upload } from '../controllers/photoController';

const router = Router();

// Mock Authentication Middleware (Replace with actual JWT verify)
const protect = (req: Request, res: Response, next: NextFunction) => {
  // Cast req to any to fix property 'headers'
  const authHeader = (req as any).headers.authorization;
  // In a real app, verify token here. 
  // For demo, we attach a mock user with the correct tier.
  (req as any).user = {
    id: "user_123",
    role: "USER",
    subscriptionTier: "ETERNAL_LEGACY" 
  };
  next();
};

/**
 * @route POST /api/photo/animate
 * @desc Animate a static photo using AI
 * @access Private (Eternal Legacy Tier)
 */
router.post('/animate', protect, upload.single('photo'), animatePhoto);

export default router;