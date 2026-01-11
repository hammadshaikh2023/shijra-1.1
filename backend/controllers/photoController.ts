import { Request, Response } from 'express';
import multer from 'multer';

// --- CONFIGURATION ---
// Mock External AI Service URL
const AI_SERVICE_URL = "https://api.shijra-ai.com/v1/animate"; 

// --- MULTER SETUP ---
const storage = multer.memoryStorage();
export const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// --- TYPES ---
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: string;
    subscriptionTier: 'FREE' | 'STARTER' | 'CONSTELLATION' | 'ETERNAL_LEGACY';
  };
  file?: any;
}

/**
 * POST /api/photo/animate
 * Protected: Requires 'ETERNAL_LEGACY' subscription
 */
export const animatePhoto = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const file = req.file;

    // 1. Validation: File Existence
    if (!file) {
      // Cast res to any to fix property 'status'
      return (res as any).status(400).json({ success: false, error: "No photo provided." });
    }

    // 2. Security: Subscription Check
    // Note: In a real app, req.user is populated by JWT middleware
    const userTier = req.user?.subscriptionTier || 'ETERNAL_LEGACY'; // Defaulting to allow demo to work
    
    if (userTier !== 'ETERNAL_LEGACY') {
      // Cast res to any to fix property 'status'
      return (res as any).status(403).json({ 
        success: false, 
        error: "Access Denied. This feature requires the Eternal Legacy subscription." 
      });
    }

    console.log(`Processing Photo Animation for User: ${req.user?.id || 'Guest'}`);

    // 3. External AI Service Integration (Mock Logic)
    // In production: Upload file to S3 -> Get URL -> Send URL to AI API -> Poll for result
    
    // Simulate Processing Delay (Cinematic Wait)
    await new Promise(resolve => setTimeout(resolve, 4000));

    // Mock Response from AI Service
    const mockResponse = {
      status: "COMPLETED",
      video_url: "https://shijra-demo-assets.s3.amazonaws.com/animated-ancestor-demo.mp4", // Replace with real generated URL
      duration: "15s"
    };

    // 4. Return Result
    // Cast res to any to fix property 'status'
    return (res as any).status(200).json({
      success: true,
      message: "Ancestor brought to life successfully.",
      data: {
        videoUrl: mockResponse.video_url,
        expiration: new Date(Date.now() + 3600 * 1000) // Link expires in 1 hour
      }
    });

  } catch (error) {
    console.error("Photo Animation Error:", error);
    // Cast res to any to fix property 'status'
    return (res as any).status(500).json({ 
      success: false, 
      error: "An error occurred while animating the photo. Please try again." 
    });
  }
};