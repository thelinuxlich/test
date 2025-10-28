import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { fetchAllClassTeachers, fetchClassTeacherDetailById, addNewClassTeacher, updateClassTeacher, getAllTeachers } from "./class-teacher-service";

const handleGetClassTeachers = asyncHandler(async (req: Request, res: Response) => {
  const classTeachers = await fetchAllClassTeachers();
  res.json({ classTeachers });
});

const handleGetClassTeacherDetail = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const detail = await fetchClassTeacherDetailById(Number(id));
  res.json(detail);
});

const handleAddClassTeacher = asyncHandler(async (req: Request, res: Response) => {
  const { class: className, section, teacher } = req.body;
  const message = await addNewClassTeacher({ className, section, teacher });
  res.json(message);
});

const handleUpdateClassTeacherDetail = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { class: className, section, teacher } = req.body;
  const message = await updateClassTeacher({ className, section, teacher, id: Number(id) });
  res.json(message);
});

const handleGetAllTeachers = asyncHandler(async (req: Request, res: Response) => {
  const teachers = await getAllTeachers();
  res.json({ teachers });
});

export {
  handleGetClassTeachers,
  handleGetClassTeacherDetail,
  handleAddClassTeacher,
  handleUpdateClassTeacherDetail,
  handleGetAllTeachers,
};

