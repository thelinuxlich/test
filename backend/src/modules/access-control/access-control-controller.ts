import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { processAddAccessControl, processUpdateAccessContorl, processDeleteAccessControl, processGetAllAccessControls, processGetMyAccessControl } from "./access-control-service";

const handleAddAccessControl = asyncHandler(async (req: Request, res: Response) => {
  const payload = req.body;
  const message = await processAddAccessControl(payload);
  res.json(message);
});

const handleUpdateAccessControl = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const payload = req.body;
  const message = await processUpdateAccessContorl({ ...payload, id: Number(id) });
  res.json(message);
});

const handleDeleteAccessControl = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const message = await processDeleteAccessControl(Number(id));
  res.json(message);
});

const handleGetAllAccessControls = asyncHandler(async (req: Request, res: Response) => {
  const permissions = await processGetAllAccessControls();
  res.json({ permissions });
});

const handleGetMyAccessControl = asyncHandler(async (req: Request, res: Response) => {
  const { roleId } = (req as any).user;
  const permissions = await processGetMyAccessControl(roleId);
  res.json({ permissions });
});

export {
  handleAddAccessControl,
  handleUpdateAccessControl,
  handleDeleteAccessControl,
  handleGetAllAccessControls,
  handleGetMyAccessControl,
};

