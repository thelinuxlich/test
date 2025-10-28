import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { fetchDashboardData } from "./dashboard-service";

const handleGetDashboardData = asyncHandler(async (req: Request, res: Response) => {
  const { id } = (req as any).user;
  const dashboard = await fetchDashboardData(id);
  res.json(dashboard);
});

export {
  handleGetDashboardData,
};

