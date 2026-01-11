
export default async function handler(req: any, res: any) {
  const { individualId } = req.query;

  // Simulate cloud matching logic
  const mockHints = [
    {
      id: "match_101",
      suggestedName: "Tariq Mahmood (Legacy Match)",
      sourceTreeName: "Global Archive",
      confidenceLevel: 98,
      matchedOn: ["Name", "Region"],
      img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&fit=crop"
    },
    {
      id: "match_102",
      suggestedName: "Al-Hamza Bin Saud",
      sourceTreeName: "Middle East Diaspora",
      confidenceLevel: 82,
      matchedOn: ["Haplogroup", "Oral History"],
      img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&fit=crop"
    }
  ];

  // Added slight delay to simulate "Thinking" edge compute
  await new Promise(resolve => setTimeout(resolve, 500));

  return res.status(200).json({
    success: true,
    data: mockHints
  });
}
