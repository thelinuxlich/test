import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import departmentService from "./department-service";

const handleGetAllDepartments = asyncHandler(async (req: Request, res: Response) => {
  const departments = await departmentService.processGetAllDepartments();
  res.json({ departments });
});

const handleAddNewDepartment = asyncHandler(async (req: Request, res: Response) => {
  const { name } = req.body;
  const message = await departmentService.processAddNewDepartment(name);
  res.json(message);
});

const handleGetDepartmentById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const department = await departmentService.processGetDepartmentById(Number(id));
  res.json(department);
});

const handleUpdateDepartmentById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name } = req.body;
  const message = await departmentService.processUpdateDepartmentById({ id: Number(id), name });
  res.json(message);
});

const handleDeleteDepartmentById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const message = await departmentService.processDeleteDepartmentById(Number(id));
  res.json(message);
});

export {
  handleGetAllDepartments,
  handleGetDepartmentById,
  handleUpdateDepartmentById,
  handleDeleteDepartmentById,
  handleAddNewDepartment,
};

