import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { processUpdateStaff, processGetAllStaffs, processReviewStaffStatus, processGetStaff, processAddStaff } from "./staffs-service";

const handleGetAllStaffs = asyncHandler(async (req: Request, res: Response) => {
  const { userId, roleId, name } = req.query;
  const staffs = await processGetAllStaffs({ userId, roleId, name });
  res.json({ staffs });
});

const handleGetStaff = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const staff = await processGetStaff(Number(id));
  res.json(staff);
});

const handleReviewStaffStatus = asyncHandler(async (req: Request, res: Response) => {
  const payload = req.body;
  const { id: userId } = req.params;
  const { id: reviewerId } = (req as any).user;
  const message = await processReviewStaffStatus({ ...payload, userId: Number(userId), reviewerId });
  res.json(message);
});

const handleAddStaff = asyncHandler(async (req: Request, res: Response) => {
  const payload = req.body;
  const message = await processAddStaff(payload);
  res.json(message);
});

const handleUpdateStaff = asyncHandler(async (req: Request, res: Response) => {
  const { id: userId } = req.params;
  const payload = req.body;
  const message = await processUpdateStaff({ ...payload, userId: Number(userId) });
  res.json(message);
});

export {
  handleGetAllStaffs,
  handleGetStaff,
  handleReviewStaffStatus,
  handleAddStaff,
  handleUpdateStaff,
};

