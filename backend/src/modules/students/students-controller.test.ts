import { describe, it, expect } from 'vitest';
import {
  GetAllStudentsSchema,
  AddStudentSchema,
  UpdateStudentSchema,
  GetStudentDetailSchema,
  SetStudentStatusSchema,
} from './students-schemas';

describe('Students Controller - Validation Tests', () => {
  describe('GetAllStudentsSchema validation', () => {
    it('should validate empty query', () => {
      const result = GetAllStudentsSchema.safeParse({});
      expect(result.success).toBe(true);
    });

    it('should validate with name filter', () => {
      const result = GetAllStudentsSchema.safeParse({ name: 'John' });
      expect(result.success).toBe(true);
    });

    it('should validate with all filters', () => {
      const result = GetAllStudentsSchema.safeParse({
        name: 'John',
        className: '10A',
        section: 'A',
        roll: 5,
      });
      expect(result.success).toBe(true);
    });
  });

  describe('AddStudentSchema validation', () => {
    const validPayload = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      roleId: 3,
    };

    it('should validate with required fields', () => {
      const result = AddStudentSchema.safeParse(validPayload);
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
        ...validPayload,
        email: 'invalid-email',
      });
      expect(result.success).toBe(false);
    });

    it('should reject short password', () => {
      const result = AddStudentSchema.safeParse({
        ...validPayload,
        password: 'short',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('UpdateStudentSchema validation', () => {
    const validPayload = {
      id: 1,
      basicDetails: {
        name: 'Updated Name',
        email: 'updated@example.com',
      },
    };

    it('should validate with required fields', () => {
      const result = UpdateStudentSchema.safeParse(validPayload);
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

    it('should reject invalid email', () => {
      const result = UpdateStudentSchema.safeParse({
        ...validPayload,
        basicDetails: {
          name: 'Updated Name',
          email: 'invalid-email',
        },
      });
      expect(result.success).toBe(false);
    });
  });

  describe('GetStudentDetailSchema validation', () => {
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
  });

  describe('SetStudentStatusSchema validation', () => {
    const validPayload = {
      userId: 1,
      reviewerId: 2,
      status: true,
    };

    it('should validate with all required fields', () => {
      const result = SetStudentStatusSchema.safeParse(validPayload);
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
        ...validPayload,
        userId: 0,
      });
      expect(result.success).toBe(false);
    });

    it('should reject non-boolean status', () => {
      const result = SetStudentStatusSchema.safeParse({
        ...validPayload,
        status: 'true',
      });
      expect(result.success).toBe(false);
    });
  });
});

