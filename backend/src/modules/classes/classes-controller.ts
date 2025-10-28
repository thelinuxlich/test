import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import {
  fetchAllClasses,
  fetchClassDetail,
  addClass,
  updateClassDetail,
  deleteClass,
} from "./classes-service";

const handleFetchAllClasses = asyncHandler(async (req: Request, res: Response) => {
  const classes = await fetchAllClasses();
  res.json({ classes });
});

const handleFetchClassDetail = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const classDetail = await fetchClassDetail(Number(id));
  res.json(classDetail);
});

const handleAddClass = asyncHandler(async (req: Request, res: Response) => {
  const { name, sections } = req.body;
  const payload = { name, sections };
  const message = await addClass(payload);
  res.json(message);
});

const handleUpdateClass = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, sections } = req.body;
  const payload = { id: Number(id), name, sections };
  const message = await updateClassDetail(payload);
  res.json(message);
});

const handleDeleteClass = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const message = await deleteClass(Number(id));
  res.json(message);
});

export {
  handleFetchAllClasses,
  handleFetchClassDetail,
  handleAddClass,
  handleUpdateClass,
  handleDeleteClass,
};

