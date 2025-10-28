import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the database BEFORE importing the module
vi.mock('../../db/database', () => ({
  getDatabase: vi.fn(),
  getPool: vi.fn(),
}));

vi.mock('go-go-try', () => ({
  goTryRaw: vi.fn(async (fn) => {
    try {
      const result = await fn();
      return [undefined, result];
    } catch (error) {
      return [error, undefined];
    }
  }),
}));

import {
  findAllStudents,
  findStudentDetail,
  addOrUpdateStudent,
  findStudentToSetStatus,
  deleteStudent,
} from './students-repository';
import { getDatabase, getPool } from '../../db/database';

describe('Students Repository', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('findAllStudents', () => {
    it('should return all students without filters', async () => {
      const mockQuery = {
        selectFrom: vi.fn().mockReturnThis(),
        leftJoin: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        orderBy: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        offset: vi.fn().mockReturnThis(),
        execute: vi.fn().mockResolvedValue([
          {
            id: 1,
            name: 'John',
            email: 'john@example.com',
            lastLogin: null,
            isActive: true,
          },
        ]),
      };

      vi.mocked(getDatabase).mockReturnValue(mockQuery as any);

      const result = await findAllStudents({});

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
      expect(result[0].name).toBe('John');
      expect(mockQuery.limit).toHaveBeenCalledWith(10);
      expect(mockQuery.offset).toHaveBeenCalledWith(0);
    });

    it('should filter by name', async () => {
      const mockQuery = {
        selectFrom: vi.fn().mockReturnThis(),
        leftJoin: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        orderBy: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        offset: vi.fn().mockReturnThis(),
        execute: vi.fn().mockResolvedValue([]),
      };

      vi.mocked(getDatabase).mockReturnValue(mockQuery as any);

      await findAllStudents({ name: 'John' });

      expect(mockQuery.where).toHaveBeenCalled();
    });

    it('should filter by className', async () => {
      const mockQuery = {
        selectFrom: vi.fn().mockReturnThis(),
        leftJoin: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        orderBy: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        offset: vi.fn().mockReturnThis(),
        execute: vi.fn().mockResolvedValue([]),
      };

      vi.mocked(getDatabase).mockReturnValue(mockQuery as any);

      await findAllStudents({ className: '10A' });

      expect(mockQuery.where).toHaveBeenCalled();
    });

    it('should filter by section', async () => {
      const mockQuery = {
        selectFrom: vi.fn().mockReturnThis(),
        leftJoin: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        orderBy: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        offset: vi.fn().mockReturnThis(),
        execute: vi.fn().mockResolvedValue([]),
      };

      vi.mocked(getDatabase).mockReturnValue(mockQuery as any);

      await findAllStudents({ section: 'A' });

      expect(mockQuery.where).toHaveBeenCalled();
    });

    it('should filter by roll', async () => {
      const mockQuery = {
        selectFrom: vi.fn().mockReturnThis(),
        leftJoin: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        orderBy: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        offset: vi.fn().mockReturnThis(),
        execute: vi.fn().mockResolvedValue([]),
      };

      vi.mocked(getDatabase).mockReturnValue(mockQuery as any);

      await findAllStudents({ roll: 5 });

      expect(mockQuery.where).toHaveBeenCalled();
    });

    it('should convert roll to number', async () => {
      const mockQuery = {
        selectFrom: vi.fn().mockReturnThis(),
        leftJoin: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        orderBy: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        offset: vi.fn().mockReturnThis(),
        execute: vi.fn().mockResolvedValue([]),
      };

      vi.mocked(getDatabase).mockReturnValue(mockQuery as any);

      await findAllStudents({ roll: '5' });

      expect(mockQuery.where).toHaveBeenCalled();
    });
  });

  describe('findStudentDetail', () => {
    it('should return student detail by id', async () => {
      const mockStudent = {
        id: 1,
        name: 'John',
        email: 'john@example.com',
        systemAccess: true,
        phone: '1234567890',
        gender: 'Male',
        dob: '2005-01-15',
        class: '10A',
        section: 'A',
        roll: 5,
        fatherName: 'Father',
        fatherPhone: '9876543210',
        motherName: 'Mother',
        motherPhone: '9876543211',
        guardianName: 'Guardian',
        guardianPhone: '9876543212',
        relationOfGuardian: 'Uncle',
        currentAddress: '123 Main St',
        permanentAddress: '456 Oak Ave',
        admissionDate: '2023-01-15',
        reporterName: 'Reporter',
      };

      const mockQuery = {
        selectFrom: vi.fn().mockReturnThis(),
        leftJoin: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        executeTakeFirst: vi.fn().mockResolvedValue(mockStudent),
      };

      vi.mocked(getDatabase).mockReturnValue(mockQuery as any);

      const result = await findStudentDetail(1);

      expect(result).toEqual(mockStudent);
      expect(mockQuery.where).toHaveBeenCalled();
    });

    it('should return undefined when student not found', async () => {
      const mockQuery = {
        selectFrom: vi.fn().mockReturnThis(),
        leftJoin: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        executeTakeFirst: vi.fn().mockResolvedValue(undefined),
      };

      vi.mocked(getDatabase).mockReturnValue(mockQuery as any);

      const result = await findStudentDetail(999);

      expect(result).toBeUndefined();
    });
  });

  describe('addOrUpdateStudent', () => {
    it('should call stored procedure with payload', async () => {
      const mockPayload = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        roleId: 3,
      };

      const mockResult = {
        status: true,
        message: 'Student added successfully',
        userId: 1,
      };

      const mockPool = {
        query: vi.fn().mockResolvedValue({
          rows: [mockResult],
        }),
      };

      vi.mocked(getPool).mockReturnValue(mockPool as any);

      const result = await addOrUpdateStudent(mockPayload);

      expect(result).toEqual(mockResult);
      expect(mockPool.query).toHaveBeenCalledWith(
        'SELECT * FROM student_add_update($1)',
        [JSON.stringify(mockPayload)]
      );
    });

    it('should handle empty result', async () => {
      const mockPayload = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        roleId: 3,
      };

      const mockPool = {
        query: vi.fn().mockResolvedValue({
          rows: [],
        }),
      };

      vi.mocked(getPool).mockReturnValue(mockPool as any);

      const result = await addOrUpdateStudent(mockPayload);

      expect(result).toBeUndefined();
    });
  });

  describe('findStudentToSetStatus', () => {
    it('should set student status', async () => {
      const mockPayload = {
        userId: 1,
        reviewerId: 2,
        status: true,
      };

      const mockQuery = {
        updateTable: vi.fn().mockReturnThis(),
        set: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        executeTakeFirst: vi.fn().mockResolvedValue({ numUpdatedRows: 1 }),
      };

      vi.mocked(getDatabase).mockReturnValue(mockQuery as any);

      const result = await findStudentToSetStatus(mockPayload);

      expect(result).toBe(1);
    });

    it('should return 0 when no rows updated', async () => {
      const mockPayload = {
        userId: 1,
        reviewerId: 2,
        status: true,
      };

      const mockQuery = {
        updateTable: vi.fn().mockReturnThis(),
        set: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        executeTakeFirst: vi.fn().mockResolvedValue({ numUpdatedRows: 0 }),
      };

      vi.mocked(getDatabase).mockReturnValue(mockQuery as any);

      const result = await findStudentToSetStatus(mockPayload);

      expect(result).toBe(0);
    });
  });

  describe('deleteStudent', () => {
    it('should delete student and user profile', async () => {
      const mockTrx = {
        deleteFrom: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        execute: vi.fn().mockResolvedValue(undefined),
        executeTakeFirst: vi.fn().mockResolvedValue({ numDeletedRows: 1 }),
      };

      vi.mocked(getDatabase).mockReturnValue({
        transaction: vi.fn().mockReturnValue({
          execute: vi.fn(async (callback) => {
            return await callback(mockTrx);
          }),
        }),
      } as any);

      const result = await deleteStudent(1);

      expect(result).toBe(1);
    });

    it('should return 0 when no rows deleted', async () => {
      const mockTrx = {
        deleteFrom: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        execute: vi.fn().mockResolvedValue(undefined),
        executeTakeFirst: vi.fn().mockResolvedValue({ numDeletedRows: 0 }),
      };

      vi.mocked(getDatabase).mockReturnValue({
        transaction: vi.fn().mockReturnValue({
          execute: vi.fn(async (callback) => {
            return await callback(mockTrx);
          }),
        }),
      } as any);

      const result = await deleteStudent(1);

      expect(result).toBe(0);
    });
  });
});

