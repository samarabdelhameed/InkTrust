import { Request, Response } from "express";

export const actionController = {
  getApprovalAction: async (req: Request, res: Response) => {
    res.json({
      title: "InkTrust Approval",
      icon: "https://inktrust.app/icon.png",
      description: "Approve fax transaction.",
      label: "Approve",
    });
  },
  postApprovalAction: async (req: Request, res: Response) => {
    res.json({ status: "transaction_generated" });
  }
};
