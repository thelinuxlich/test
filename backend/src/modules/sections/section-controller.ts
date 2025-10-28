import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { processGetAllSections, processGetSectionById, processUpdateSectionById, processDeleteSectionById, processAddNewSection } from "./section-service";

const handleGetAllSections = asyncHandler(async (req: Request, res: Response) => {
  const sections = await processGetAllSections();
  res.json({ sections });
});

const handleAddNewSection = asyncHandler(async (req: Request, res: Response) => {
  const { name } = req.body;
  const message = await processAddNewSection(name);
  res.json(message);
});

const handleGetSectionById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const section = await processGetSectionById(Number(id));
  res.json(section);
});

const handleUpdateSectionById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name } = req.body;
  const message = await processUpdateSectionById({ id: Number(id), name });
  res.json(message);
});

const handleDeleteSectionById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const message = await processDeleteSectionById(Number(id));
  res.json(message);
});

export {
  handleGetAllSections,
  handleGetSectionById,
  handleUpdateSectionById,
  handleDeleteSectionById,
  handleAddNewSection,
};

