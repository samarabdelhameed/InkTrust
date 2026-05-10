import { Request, Response } from "express";

export const aiAnalysisController = async (req: Request, res: Response) => {
  try {
    console.log("[AI] 🧠 Received analysis request");
    res.json({ status: "analyzing" });
  } catch (error) {
    res.status(500).json({ error: "Analysis failed" });
  }
};
