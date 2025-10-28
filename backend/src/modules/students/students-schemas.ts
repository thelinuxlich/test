import { z } from "zod";

/**
 * Schema for getAllStudents query parameters
 * Used in: findAllStudents()
 */
export const GetAllStudentsSchema = z.object({
  page: z.union([z.string(), z.number()]).transform((val) => Math.max(1, Number(val))).optional().default(1),
  limit: z.union([z.string(), z.number()]).transform((val) => Math.max(1, Math.min(100, Number(val)))).optional().default(10),
  name: z.string().optional(),
  className: z.string().optional(),
  section: z.string().optional(),
  roll: z.union([z.string(), z.number()]).optional(),
});

export type GetAllStudentsPayload = z.infer<typeof GetAllStudentsSchema>;

/**
 * Schema for addNewStudent request body
 * Used in: addOrUpdateStudent()
 */
export const AddStudentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  roleId: z.number().int().positive("Role ID must be a positive integer"),
  phone: z.string().optional(),
  gender: z.string().optional(),
  dob: z.string().datetime().optional(),
  className: z.string().optional(),
  sectionName: z.string().optional(),
  roll: z.number().int().optional(),
  fatherName: z.string().optional(),
  fatherPhone: z.string().optional(),
  motherName: z.string().optional(),
  motherPhone: z.string().optional(),
  guardianName: z.string().optional(),
  guardianPhone: z.string().optional(),
  relationOfGuardian: z.string().optional(),
  currentAddress: z.string().optional(),
  permanentAddress: z.string().optional(),
  admissionDt: z.string().datetime().optional(),
});

export type AddStudentPayload = z.infer<typeof AddStudentSchema>;

/**
 * Schema for updateStudent request body
 * Used in: addOrUpdateStudent()
 */
export const UpdateStudentSchema = z.object({
  id: z.number().int().positive("Student ID must be a positive integer"),
  basicDetails: z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
  }),
  phone: z.string().optional(),
  gender: z.string().optional(),
  dob: z.string().datetime().optional(),
  className: z.string().optional(),
  sectionName: z.string().optional(),
  roll: z.number().int().optional(),
  fatherName: z.string().optional(),
  fatherPhone: z.string().optional(),
  motherName: z.string().optional(),
  motherPhone: z.string().optional(),
  guardianName: z.string().optional(),
  guardianPhone: z.string().optional(),
  relationOfGuardian: z.string().optional(),
  currentAddress: z.string().optional(),
  permanentAddress: z.string().optional(),
});

export type UpdateStudentPayload = z.infer<typeof UpdateStudentSchema>;

/**
 * Schema for getStudentDetail path parameter
 * Used in: findStudentDetail()
 */
export const GetStudentDetailSchema = z.object({
  id: z.string().transform((val) => Number(val)).pipe(z.number().int().positive("Student ID must be a positive integer")),
});

export type GetStudentDetailPayload = z.infer<typeof GetStudentDetailSchema>;

/**
 * Schema for setStudentStatus request body
 * Used in: findStudentToSetStatus()
 */
export const SetStudentStatusSchema = z.object({
  userId: z.number().int().positive("User ID must be a positive integer"),
  reviewerId: z.number().int().positive("Reviewer ID must be a positive integer"),
  status: z.boolean(),
});

export type SetStudentStatusPayload = z.infer<typeof SetStudentStatusSchema>;

/**
 * Combined schema for all student payloads
 * Useful for type checking in repository functions
 */
export const StudentPayloadSchema = z.union([
  GetAllStudentsSchema,
  AddStudentSchema,
  UpdateStudentSchema,
  SetStudentStatusSchema,
]);

export type StudentPayload = z.infer<typeof StudentPayloadSchema>;

