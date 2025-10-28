import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import {
  fetchRoles,
  addRole,
  updateRole,
  processRoleStatus,
  fetchRole,
  addRolePermission,
  getRolePermissions,
  fetchUsersByRoleId,
  processSwitchRole
} from "./rp-service";

const handleGetRoles = asyncHandler(async (req: Request, res: Response) => {
  const roles = await fetchRoles();
  res.json({ roles });
});

const handleGetRole = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const role = await fetchRole(Number(id));
  res.json(role);
});

const handleAddRole = asyncHandler(async (req: Request, res: Response) => {
  const { name } = req.body;
  const message = await addRole(name);
  res.json(message);
});

const handleUpdateRole = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name } = req.body;
  const message = await updateRole(Number(id), name);
  res.json(message);
});

const handleRoleStatus = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  const message = await processRoleStatus(Number(id), status);
  res.json(message);
});

const handleAddRolePermission = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { permissions } = req.body;
  const message = await addRolePermission(Number(id), permissions);
  res.json(message);
});

const handleGetRolePermission = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const permissions = await getRolePermissions(Number(id));
  res.json({ permissions });
});

const handleGetUsersByRoleId = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const users = await fetchUsersByRoleId(Number(id));
  res.json({ users });
});

const handleSwitchRole = asyncHandler(async (req: Request, res: Response) => {
  const { userId, roleId } = req.body;
  const message = await processSwitchRole(userId, roleId);
  res.json(message);
});

export {
  handleAddRole,
  handleGetRoles,
  handleUpdateRole,
  handleRoleStatus,
  handleGetRole,
  handleAddRolePermission,
  handleGetRolePermission,
  handleGetUsersByRoleId,
  handleSwitchRole,
};

