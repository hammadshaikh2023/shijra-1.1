import { Request, Response } from 'express';

// --- TYPES ---
interface Hint {
  id: string;
  suggestedName: string;
  sourceTreeId: string;
  sourceTreeName: string;
  confidenceLevel: number; // 0-100
  matchedOn: string[]; // e.g., ['Surname', 'Birth Year', 'Location']
  img: string;
}

// --- MOCK DATABASE ACCESS ---
const DB = {
  trees: {
    // Simulating a DB call to check tree privacy settings
    getPrivacySettings: async (treeId: string) => {
      // Logic: In a real app, query DB. Here we mock it.
      // If the ID ends in 'private', we simulate a private tree.
      if (treeId.endsWith('_private')) return 'PRIVATE';
      return 'SHARED';
    }
  }
};

/**
 * GET /api/hints/:individualId
 * Returns smart matches for a specific individual in the tree.
 */
export const getAncestryHints = async (req: Request, res: Response) => {
  try {
    // Cast req to any to fix properties 'params' and 'query'
    const { individualId } = (req as any).params;
    const { treeId } = (req as any).query; // Passed from frontend

    // 1. Privacy Check (Business Logic)
    // Smart matching only works if the user opts into 'SHARED' pooling
    const privacy = await DB.trees.getPrivacySettings(String(treeId));
    
    if (privacy !== 'SHARED') {
      // Cast res to any to fix property 'status'
      return (res as any).status(200).json({
        success: true,
        message: "Smart Matching is disabled for Private trees.",
        data: [] 
      });
    }

    // 2. Generate Mock Hints (Simulation of AI/Fuzzy Matching)
    // In production, this would use Elasticsearch or a Graph DB query
    const mockHints: Hint[] = [
      {
        id: "match_101",
        suggestedName: "Tariq Mahmood (Late)",
        sourceTreeId: "tree_55",
        sourceTreeName: "Mahmood Lineage",
        confidenceLevel: 98,
        matchedOn: ["Full Name", "Birth Year (1942)", "Location (Lahore)"],
        img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"
      },
      {
        id: "match_102",
        suggestedName: "T. M. Khan",
        sourceTreeId: "tree_89",
        sourceTreeName: "Khan Family Archival",
        confidenceLevel: 85,
        matchedOn: ["Surname", "Approx. Death Date"],
        img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop"
      },
      {
        id: "match_103",
        suggestedName: "Unknown Father of Ahmed",
        sourceTreeId: "tree_12",
        sourceTreeName: "Global Public Records",
        confidenceLevel: 65,
        matchedOn: ["Child Name Match"],
        img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop"
      }
    ];

    // Simulate delay for dramatic effect
    await new Promise(resolve => setTimeout(resolve, 800));

    // Cast res to any to fix property 'status'
    return (res as any).status(200).json({
      success: true,
      data: mockHints
    });

  } catch (error) {
    console.error("Hints Error:", error);
    // Cast res to any to fix property 'status'
    return (res as any).status(500).json({ 
      success: false, 
      error: "Unable to calculate smart matches at this time." 
    });
  }
};