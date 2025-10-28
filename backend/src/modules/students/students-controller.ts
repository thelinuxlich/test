import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { assertHTTP } from "../../utils/assertHTTP";
import {
  getAllStudents,
  addNewStudent,
  getStudentDetail,
  setStudentStatus,
  updateStudent,
  removeStudent,
} from "./students-service";
import {
  GetAllStudentsSchema,
  AddStudentSchema,
  UpdateStudentSchema,
  GetStudentDetailSchema,
  SetStudentStatusSchema,
} from "./students-schemas";

export const handleGetAllStudents = asyncHandler(async (req: Request, res: Response) => {
  const queryData = {
    page: req.query.page,
    limit: req.query.limit,
    name: req.query.name || req.query.search,
    className: req.query.className || req.query.class,
    section: req.query.section,
    roll: req.query.roll,
  };

  const validationResult = GetAllStudentsSchema.safeParse(queryData);
  assertHTTP(validationResult.success, `Validation error: ${validationResult.error?.message}`, '400');

  const students = await getAllStudents(validationResult.data);
  res.json({ students });
});

export const handleAddStudent = asyncHandler(async (req: Request, res: Response) => {
  const validationResult = AddStudentSchema.safeParse(req.body);
  assertHTTP(validationResult.success, `Validation error: ${validationResult.error?.message}`, '400');

  const message = await addNewStudent(validationResult.data);
  res.json(message);
});

export const handleUpdateStudent = asyncHandler(async (req: Request, res: Response) => {
  const validationResult = UpdateStudentSchema.safeParse(req.body);
  assertHTTP(validationResult.success, `Validation error: ${validationResult.error?.message}`, '400');

  const message = await updateStudent(validationResult.data);
  res.json(message);
});

export const handleGetStudentDetail = asyncHandler(async (req: Request, res: Response) => {
  const validationResult = GetStudentDetailSchema.safeParse({ id: req.params.id });
  assertHTTP(validationResult.success, `Validation error: ${validationResult.error?.message}`, '400');

  const student = await getStudentDetail(validationResult.data.id);
  res.json(student);
});

export const handleStudentStatus = asyncHandler(async (req: Request, res: Response) => {
  const validationResult = SetStudentStatusSchema.safeParse({
    userId: Number(req.params.id),
    reviewerId: req.body.reviewerId,
    status: req.body.status,
  });
  assertHTTP(validationResult.success, `Validation error: ${validationResult.error?.message}`, '400');

  const message = await setStudentStatus(validationResult.data);
  res.json(message);
});

export const handleDeleteStudent = asyncHandler(async (req: Request, res: Response) => {
  const validationResult = GetStudentDetailSchema.safeParse({ id: req.params.id });
  assertHTTP(validationResult.success, `Validation error: ${validationResult.error?.message}`, '400');

  const message = await removeStudent(validationResult.data.id);
  res.json(message);
});
