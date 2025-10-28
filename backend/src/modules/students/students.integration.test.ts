import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { getDatabase, destroyDatabase } from '../../db/database';
import type { Kysely } from 'kysely';
import type { DB } from '../../types/database';
import {
  findAllStudents,
  findStudentDetail,
  addOrUpdateStudent,
  findStudentToSetStatus,
  deleteStudent,
  getRoleId,
  type StudentPayload,
  type StudentStatusPayload,
} from './students-repository';

describe('Students Module - Integration Tests', () => {
  let db: Kysely<DB>;
  let testUserId: number;
  let studentRoleId: number;

  beforeAll(async () => {
    db = getDatabase();
    studentRoleId = await getRoleId('Student');
    expect(studentRoleId).toBeGreaterThan(0);
    const classesToCreate = ['Class A', 'Class B', 'Class C'];
    const sectionsToCreate = ['Section 1', 'Section 2', 'Section 3'];

    for (const className of classesToCreate) {
      const existingClass = await db
        .selectFrom('classes')
        .select('id')
        .where('name', '=', className)
        .executeTakeFirst();

      if (!existingClass) {
        await db
          .insertInto('classes')
          .values({
            name: className,
            sections: 1,
          })
          .execute();
      }
    }

    for (const sectionName of sectionsToCreate) {
      const existingSection = await db
        .selectFrom('sections')
        .select('id')
        .where('name', '=', sectionName)
        .executeTakeFirst();

      if (!existingSection) {
        await db
          .insertInto('sections')
          .values({
            name: sectionName,
          })
          .execute();
      }
    }
  });

  afterAll(async () => {
    if (testUserId) {
      await db.deleteFrom('userProfiles').where('userId', '=', testUserId).execute();
      await db.deleteFrom('users').where('id', '=', testUserId).execute();
    }
    await destroyDatabase();
  });

  describe('getRoleId', () => {
    it('should return student role ID', async () => {
      const roleId = await getRoleId('Student');
      expect(roleId).toBeGreaterThan(0);
      expect(typeof roleId).toBe('number');
    });

    it('should return admin role ID', async () => {
      const roleId = await getRoleId('Admin');
      expect(roleId).toBeGreaterThan(0);
    });

    it('should throw error for non-existent role', async () => {
      await expect(getRoleId('NonExistentRole')).rejects.toThrow();
    });
  });

  describe('addOrUpdateStudent', () => {
    it('should add a new student to the database', async () => {
      const payload: StudentPayload = {
        name: 'Integration Test Student',
        email: `test-${Date.now()}@example.com`,
        password: 'TestPassword123!',
        roleId: studentRoleId,
        className: 'Class A',
        section: 'Section 1',
        roll: '001',
      };

      const result = await addOrUpdateStudent(payload);

      expect(result.status).toBe(true);
      expect(result.userId).toBeGreaterThan(0);
      expect(result.message).toContain('successfully');

      testUserId = result.userId;

      const user = await db
        .selectFrom('users')
        .selectAll()
        .where('id', '=', testUserId)
        .executeTakeFirst();

      expect(user).toBeDefined();
      expect(user?.email).toBe(payload.email);
    });

    it('should update existing student', async () => {
      const createPayload: StudentPayload = {
        name: 'Update Test Student',
        email: `update-test-${Date.now()}@example.com`,
        password: 'TestPassword123!',
        roleId: studentRoleId,
        className: 'Class A',
        section: 'Section 1',
      };

      const createResult = await addOrUpdateStudent(createPayload);
      const userId = createResult.userId;

      const updatePayload: StudentPayload = {
        userId: userId,
        name: 'Updated Student Name',
        email: createPayload.email,
        className: 'Class A',
        section: 'Section 1',
      };

      const updateResult = await addOrUpdateStudent(updatePayload);

      expect(updateResult.status).toBe(true);

      const updatedUser = await db
        .selectFrom('users')
        .selectAll()
        .where('id', '=', userId)
        .executeTakeFirst();

      expect(updatedUser?.name).toBe('Updated Student Name');

      testUserId = userId;
    });
  });

  describe('findAllStudents', () => {
    it('should retrieve all students from database', async () => {
      const students = await findAllStudents({});

      expect(Array.isArray(students)).toBe(true);
      expect(students.length).toBeGreaterThanOrEqual(0);

      if (students.length > 0) {
        const student = students[0];
        expect(student).toHaveProperty('id');
        expect(student).toHaveProperty('name');
        expect(student).toHaveProperty('email');
        expect(student).toHaveProperty('systemAccess');
      }
    });

    it('should filter students by name', async () => {
      const payload: StudentPayload = {
        name: 'Unique Test Name',
        email: `unique-${Date.now()}@example.com`,
        password: 'TestPassword123!',
        roleId: studentRoleId,
      };

      const result = await addOrUpdateStudent(payload);
      testUserId = result.userId;

      const students = await findAllStudents({ name: 'Unique Test Name' });

      expect(students.length).toBeGreaterThan(0);
      expect(students.some((s) => s.name === 'Unique Test Name')).toBe(true);
    });

    it('should filter students by email', async () => {
      const email = `email-filter-${Date.now()}@example.com`;
      const payload: StudentPayload = {
        name: 'Email Filter Test',
        email,
        password: 'TestPassword123!',
        roleId: studentRoleId,
      };

      const result = await addOrUpdateStudent(payload);
      testUserId = result.userId;

      const students = await findAllStudents({ email });

      expect(students.length).toBeGreaterThan(0);
      expect(students.some((s) => s.email === email)).toBe(true);
    });
  });

  describe('findStudentDetail', () => {
    it('should retrieve detailed student information', async () => {
      const payload: StudentPayload = {
        name: 'Detail Test Student',
        email: `detail-${Date.now()}@example.com`,
        password: 'TestPassword123!',
        roleId: studentRoleId,
        class: 'Class B',
        section: 'Section 2',
        roll: 2,
      };

      const result = await addOrUpdateStudent(payload);
      testUserId = result.userId;

      const student = await findStudentDetail(testUserId);

      expect(student).toBeDefined();
      expect(student?.id).toBe(testUserId);
      expect(student?.name).toBe('Detail Test Student');
      expect(student?.email).toBe(payload.email);
      expect(student?.class).toBe('Class B');
      expect(student?.section).toBe('Section 2');
      expect(student?.roll).toBe(2);
    });

    it('should return undefined for non-existent student', async () => {
      const student = await findStudentDetail(999999);
      expect(student).toBeUndefined();
    });
  });

  describe('findStudentToSetStatus', () => {
    it('should update student status in database', async () => {
      const payload: StudentPayload = {
        name: 'Status Test Student',
        email: `status-${Date.now()}@example.com`,
        password: 'TestPassword123!',
        roleId: studentRoleId,
      };

      const result = await addOrUpdateStudent(payload);
      testUserId = result.userId;

      const initialUser = await db
        .selectFrom('users')
        .select('isActive')
        .where('id', '=', testUserId)
        .executeTakeFirst();

      const initialStatus = initialUser?.isActive;

      const statusPayload: StudentStatusPayload = {
        userId: testUserId,
        reviewerId: 1, // Admin user
        status: !initialStatus,
      };

      const updateResult = await findStudentToSetStatus(statusPayload);

      expect(updateResult).toBeGreaterThanOrEqual(0);

      const updatedUser = await db
        .selectFrom('users')
        .select('isActive')
        .where('id', '=', testUserId)
        .executeTakeFirst();

      expect(updatedUser?.isActive).toBe(!initialStatus);
    });

    it('should return 0 when updating non-existent student', async () => {
      const statusPayload: StudentStatusPayload = {
        userId: 999999,
        reviewerId: 1,
        status: true,
      };

      const result = await findStudentToSetStatus(statusPayload);

      expect(result).toBe(0);
    });
  });

  describe('deleteStudent', () => {
    let deleteTestUserId: number;

    beforeEach(async () => {
      const payload: StudentPayload = {
        name: 'Delete Test Student',
        email: `delete-${Date.now()}@example.com`,
        password: 'TestPassword123!',
        roleId: studentRoleId,
        className: 'Class A',
        section: 'Section 1',
        roll: '999',
      };

      const result = await addOrUpdateStudent(payload);
      deleteTestUserId = result.userId;
    });

    it('should delete student and user profile', async () => {
      const result = await deleteStudent(deleteTestUserId);

      expect(result).toBe(1);

      const deletedUser = await db
        .selectFrom('users')
        .select('id')
        .where('id', '=', deleteTestUserId)
        .executeTakeFirst();

      expect(deletedUser).toBeUndefined();
    });

    it('should return 0 when deleting non-existent student', async () => {
      const result = await deleteStudent(999999);

      expect(result).toBe(0);
    });
  });

  describe('End-to-End Student Workflow', () => {
    it('should complete full student lifecycle', async () => {
      const createPayload: StudentPayload = {
        name: 'E2E Test Student',
        email: `e2e-${Date.now()}@example.com`,
        password: 'TestPassword123!',
        roleId: studentRoleId,
        className: 'Class C',
        section: 'Section 3',
        roll: '003',
      };

      const createResult = await addOrUpdateStudent(createPayload);
      expect(createResult.status).toBe(true);
      testUserId = createResult.userId;

      const detail = await findStudentDetail(testUserId);
      expect(detail).toBeDefined();
      expect(detail?.name).toBe('E2E Test Student');

      const allStudents = await findAllStudents({ email: createPayload.email });
      expect(allStudents.length).toBeGreaterThan(0);
      expect(allStudents.some((s) => s.id === testUserId)).toBe(true);

      const statusPayload: StudentStatusPayload = {
        userId: testUserId,
        reviewerId: 1,
        status: false,
      };

      const statusResult = await findStudentToSetStatus(statusPayload);
      expect(statusResult).toBeGreaterThanOrEqual(0);

      const finalDetail = await findStudentDetail(testUserId);
      expect(finalDetail?.systemAccess).toBe(false);
    });
  });
});

