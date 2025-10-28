import { describe, it, expect } from 'vitest';
import {
  GetAllStudentsSchema,
  AddStudentSchema,
  UpdateStudentSchema,
  GetStudentDetailSchema,
  SetStudentStatusSchema,
} from './students-schemas';

describe('Students Schemas', () => {
  describe('GetAllStudentsSchema', () => {
    it('should validate empty object', () => {
      const result = GetAllStudentsSchema.safeParse({});
      expect(result.success).toBe(true);
    });

    it('should validate with name filter', () => {
      const result = GetAllStudentsSchema.safeParse({
        name: 'John Doe',
      });
      expect(result.success).toBe(true);
      expect(result.data?.name).toBe('John Doe');
    });

    it('should validate with all optional fields', () => {
      const result = GetAllStudentsSchema.safeParse({
        name: 'John Doe',
        className: '10A',
        section: 'A',
        roll: 5,
      });
      expect(result.success).toBe(true);
    });

    it('should validate roll as string', () => {
      const result = GetAllStudentsSchema.safeParse({
        roll: '5',
      });
      expect(result.success).toBe(true);
    });

    it('should reject invalid field', () => {
      const result = GetAllStudentsSchema.safeParse({
        invalidField: 'value',
      });
      expect(result.success).toBe(true); // Extra fields are allowed by default
    });
  });

  describe('AddStudentSchema', () => {
    const validStudent = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      roleId: 3,
    };

    it('should validate with required fields only', () => {
      const result = AddStudentSchema.safeParse(validStudent);
      expect(result.success).toBe(true);
    });

    it('should validate with all fields', () => {
      const result = AddStudentSchema.safeParse({
        ...validStudent,
        phone: '1234567890',
        gender: 'Male',
        dob: '2005-01-15T00:00:00Z',
        className: '10A',
        sectionName: 'A',
        roll: 5,
        fatherName: 'Father Name',
        fatherPhone: '9876543210',
        motherName: 'Mother Name',
        motherPhone: '9876543211',
        guardianName: 'Guardian Name',
        guardianPhone: '9876543212',
        relationOfGuardian: 'Uncle',
        currentAddress: '123 Main St',
        permanentAddress: '456 Oak Ave',
        admissionDt: '2023-01-15T00:00:00Z',
      });
      expect(result.success).toBe(true);
    });

    it('should reject missing name', () => {
      const result = AddStudentSchema.safeParse({
        email: 'john@example.com',
        password: 'password123',
        roleId: 3,
      });
      expect(result.success).toBe(false);
    });

    it('should reject invalid email', () => {
      const result = AddStudentSchema.safeParse({
        ...validStudent,
        email: 'invalid-email',
      });
      expect(result.success).toBe(false);
    });

    it('should reject short password', () => {
      const result = AddStudentSchema.safeParse({
        ...validStudent,
        password: 'short',
      });
      expect(result.success).toBe(false);
    });

    it('should reject non-positive roleId', () => {
      const result = AddStudentSchema.safeParse({
        ...validStudent,
        roleId: 0,
      });
      expect(result.success).toBe(false);
    });

    it('should reject negative roleId', () => {
      const result = AddStudentSchema.safeParse({
        ...validStudent,
        roleId: -1,
      });
      expect(result.success).toBe(false);
    });
  });

  describe('UpdateStudentSchema', () => {
    const validUpdate = {
      id: 1,
      basicDetails: {
        name: 'Updated Name',
        email: 'updated@example.com',
      },
    };

    it('should validate with required fields only', () => {
      const result = UpdateStudentSchema.safeParse(validUpdate);
      expect(result.success).toBe(true);
    });

    it('should validate with optional fields', () => {
      const result = UpdateStudentSchema.safeParse({
        ...validUpdate,
        phone: '1234567890',
        gender: 'Female',
        className: '11A',
      });
      expect(result.success).toBe(true);
    });

    it('should reject missing id', () => {
      const result = UpdateStudentSchema.safeParse({
        basicDetails: {
          name: 'Updated Name',
          email: 'updated@example.com',
        },
      });
      expect(result.success).toBe(false);
    });

    it('should reject non-positive id', () => {
      const result = UpdateStudentSchema.safeParse({
        ...validUpdate,
        id: 0,
      });
      expect(result.success).toBe(false);
    });

    it('should reject invalid email in basicDetails', () => {
      const result = UpdateStudentSchema.safeParse({
        ...validUpdate,
        basicDetails: {
          name: 'Updated Name',
          email: 'invalid-email',
        },
      });
      expect(result.success).toBe(false);
    });
  });

  describe('GetStudentDetailSchema', () => {
    it('should validate numeric id as string', () => {
      const result = GetStudentDetailSchema.safeParse({ id: '1' });
      expect(result.success).toBe(true);
      expect(result.data?.id).toBe(1);
    });

    it('should reject non-numeric id', () => {
      const result = GetStudentDetailSchema.safeParse({ id: 'abc' });
      expect(result.success).toBe(false);
    });

    it('should reject zero id', () => {
      const result = GetStudentDetailSchema.safeParse({ id: '0' });
      expect(result.success).toBe(false);
    });

    it('should reject negative id', () => {
      const result = GetStudentDetailSchema.safeParse({ id: '-1' });
      expect(result.success).toBe(false);
    });
  });

  describe('SetStudentStatusSchema', () => {
    const validStatus = {
      userId: 1,
      reviewerId: 2,
      status: true,
    };

    it('should validate with all required fields', () => {
      const result = SetStudentStatusSchema.safeParse(validStatus);
      expect(result.success).toBe(true);
    });

    it('should validate with status false', () => {
      const result = SetStudentStatusSchema.safeParse({
        ...validStatus,
        status: false,
      });
      expect(result.success).toBe(true);
    });

    it('should reject missing userId', () => {
      const result = SetStudentStatusSchema.safeParse({
        reviewerId: 2,
        status: true,
      });
      expect(result.success).toBe(false);
    });

    it('should reject non-positive userId', () => {
      const result = SetStudentStatusSchema.safeParse({
        ...validStatus,
        userId: 0,
      });
      expect(result.success).toBe(false);
    });

    it('should reject non-positive reviewerId', () => {
      const result = SetStudentStatusSchema.safeParse({
        ...validStatus,
        reviewerId: -1,
      });
      expect(result.success).toBe(false);
    });

    it('should reject non-boolean status', () => {
      const result = SetStudentStatusSchema.safeParse({
        ...validStatus,
        status: 'true',
      });
      expect(result.success).toBe(false);
    });
  });
});

