// --- DNA MATCHING WORKER ---
// This runs in a separate thread to prevent UI freezing during heavy calculation.

/* eslint-disable no-restricted-globals */

// Types needed inside the worker
interface DNAData {
  rsid: string;
  chromosome: string;
  position: number;
  genotype: string;
}

interface WorkerMessage {
  type: 'CALCULATE_MATCH';
  payload: {
    userKit: DNAData[];
    targetKits: { id: string; data: DNAData[] }[];
  };
}

// Listen for messages from Main Thread
self.onmessage = (e: MessageEvent<WorkerMessage>) => {
  if (e.data.type === 'CALCULATE_MATCH') {
    const { userKit, targetKits } = e.data.payload;
    
    const results = targetKits.map(target => {
      // Heavy Computation: Compare thousands of SNPs
      const matchDetails = compareDNA(userKit, target.data);
      return {
        id: target.id,
        ...matchDetails
      };
    });

    // Send results back to Main Thread
    self.postMessage({ type: 'MATCH_RESULT', payload: results });
  }
};

// DNA Comparison Logic (Simplified for Demo)
function compareDNA(kit1: DNAData[], kit2: DNAData[]) {
  let sharedSegments = 0;
  let totalCM = 0;
  
  // Create a map for O(1) lookup
  const map1 = new Map(kit1.map(snp => [snp.rsid, snp]));

  for (const snp2 of kit2) {
    const snp1 = map1.get(snp2.rsid);
    if (snp1 && snp1.genotype === snp2.genotype) {
       // Logic to detect continuous segments would go here
       // For demo, we just count matching SNPs as a rough proxy
       sharedSegments++;
    }
  }

  // Mock calculation of Centimorgans based on shared SNPs
  totalCM = (sharedSegments / 100) * 1.2; // Arbitrary multiplier

  return {
    cM: Math.round(totalCM),
    segments: Math.floor(sharedSegments / 500), // Arbitrary segment count
    matchPercentage: (sharedSegments / kit1.length) * 100
  };
}

export {};
