import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  checkStudentId,
  getAllStudents,
  getStudentDetail,
  addNewStudent,
  updateStudent,
  setStudentStatus,
  removeStudent,
} from './students-service';

vi.mock('./students-repository', () => ({
  findAllStudents: vi.fn(),
  findStudentDetail: vi.fn(),
  addOrUpdateStudent: vi.fn(),
  findStudentToSetStatus: vi.fn(),
  deleteStudent: vi.fn(),
}));

vi.mock('../../shared/repository', () => ({
  findUserById: vi.fn(),
}));

vi.mock('../../utils', () => ({
  sendAccountVerificationEmail: vi.fn(),
}));

vi.mock('../../utils/assertHTTP', () => ({
  assertHTTP: vi.fn((condition, message, code) => {
    if (!condition) {
      const error = new Error(message);
      (error as any).statusCode = code;
      throw error;
    }
  }),
}));

import * as studentRepository from './students-repository';
import * as sharedRepository from '../../shared/repository';
import * as utils from '../../utils';

describe('Students Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('checkStudentId', () => {
    it('should not throw when student exists', async () => {
      vi.mocked(sharedRepository.findUserById).mockResolvedValue({ id: 1 } as any);

      await expect(checkStudentId(1)).resolves.toBeUndefined();
    });

    it('should throw when student does not exist', async () => {
      vi.mocked(sharedRepository.findUserById).mockResolvedValue(null);

      await expect(checkStudentId(1)).rejects.toThrow();
    });
  });

  describe('getAllStudents', () => {
    it('should return students when found', async () => {
      const mockStudents = [
        { id: 1, name: 'John', email: 'john@example.com', lastLogin: null, systemAccess: true },
        { id: 2, name: 'Jane', email: 'jane@example.com', lastLogin: null, systemAccess: true },
      ];
      vi.mocked(studentRepository.findAllStudents).mockResolvedValue(mockStudents);

      const result = await getAllStudents({});

      expect(result).toEqual(mockStudents);
      expect(studentRepository.findAllStudents).toHaveBeenCalledWith({});
    });

    it('should throw when no students found', async () => {
      vi.mocked(studentRepository.findAllStudents).mockResolvedValue([]);

      await expect(getAllStudents({})).rejects.toThrow();
    });

    it('should pass filter parameters to repository', async () => {
      const mockStudents = [
        { id: 1, name: 'John', email: 'john@example.com', lastLogin: null, systemAccess: true },
      ];
      vi.mocked(studentRepository.findAllStudents).mockResolvedValue(mockStudents);

      const filters = { name: 'John', className: '10A' };
      await getAllStudents(filters);

      expect(studentRepository.findAllStudents).toHaveBeenCalledWith(filters);
    });
  });

  describe('getStudentDetail', () => {
    it('should return student detail when found', async () => {
      const mockStudent = {
        id: 1,
        name: 'John',
        email: 'john@example.com',
        systemAccess: true,
        phone: '1234567890',
        gender: 'Male',
        dob: new Date('2005-01-15'),
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
        admissionDate: new Date('2023-01-15'),
        reporterName: 'Reporter',
      };
      vi.mocked(sharedRepository.findUserById).mockResolvedValue({ id: 1 } as any);
      vi.mocked(studentRepository.findStudentDetail).mockResolvedValue(mockStudent);

      const result = await getStudentDetail(1);

      expect(result).toEqual(mockStudent);
      expect(studentRepository.findStudentDetail).toHaveBeenCalledWith(1);
    });

    it('should throw when student not found', async () => {
      vi.mocked(sharedRepository.findUserById).mockResolvedValue(null);

      await expect(getStudentDetail(1)).rejects.toThrow();
    });

    it('should throw when student detail not found', async () => {
      vi.mocked(sharedRepository.findUserById).mockResolvedValue({ id: 1 } as any);
      vi.mocked(studentRepository.findStudentDetail).mockResolvedValue(undefined);

      await expect(getStudentDetail(1)).rejects.toThrow();
    });
  });

  describe('addNewStudent', () => {
    const validPayload = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      roleId: 3,
    };

    it('should add student and send email successfully', async () => {
      const mockResult = {
        status: true,
        message: 'Student added successfully',
        userId: 1,
      };
      vi.mocked(studentRepository.addOrUpdateStudent).mockResolvedValue(mockResult);
      vi.mocked(utils.sendAccountVerificationEmail).mockResolvedValue(undefined);

      const result = await addNewStudent(validPayload);

      expect(result.message).toContain('verification email sent successfully');
      expect(studentRepository.addOrUpdateStudent).toHaveBeenCalledWith(validPayload);
      expect(utils.sendAccountVerificationEmail).toHaveBeenCalled();
    });

    it('should add student but handle email failure gracefully', async () => {
      const mockResult = {
        status: true,
        message: 'Student added successfully',
        userId: 1,
      };
      vi.mocked(studentRepository.addOrUpdateStudent).mockResolvedValue(mockResult);
      vi.mocked(utils.sendAccountVerificationEmail).mockRejectedValue(new Error('Email failed'));

      const result = await addNewStudent(validPayload);

      expect(result.message).toContain('failed to send verification email');
    });

    it('should throw when student addition fails', async () => {
      const mockResult = {
        status: false,
        message: 'Failed to add student',
      };
      vi.mocked(studentRepository.addOrUpdateStudent).mockResolvedValue(mockResult);

      await expect(addNewStudent(validPayload)).rejects.toThrow();
    });
  });

  describe('updateStudent', () => {
    const validPayload = {
      id: 1,
      basicDetails: {
        name: 'Updated Name',
        email: 'updated@example.com',
      },
    };

    it('should update student successfully', async () => {
      const mockResult = {
        status: true,
        message: 'Student updated successfully',
      };
      vi.mocked(studentRepository.addOrUpdateStudent).mockResolvedValue(mockResult);

      const result = await updateStudent(validPayload);

      expect(result.message).toBe('Student updated successfully');
      expect(studentRepository.addOrUpdateStudent).toHaveBeenCalledWith(validPayload);
    });

    it('should throw when update fails', async () => {
      const mockResult = {
        status: false,
        message: 'Failed to update student',
      };
      vi.mocked(studentRepository.addOrUpdateStudent).mockResolvedValue(mockResult);

      await expect(updateStudent(validPayload)).rejects.toThrow();
    });
  });

  describe('setStudentStatus', () => {
    const validPayload = {
      userId: 1,
      reviewerId: 2,
      status: true,
    };

    it('should set student status successfully', async () => {
      vi.mocked(sharedRepository.findUserById).mockResolvedValue({ id: 1 } as any);
      vi.mocked(studentRepository.findStudentToSetStatus).mockResolvedValue(1);

      const result = await setStudentStatus(validPayload);

      expect(result.message).toBe('Student status changed successfully');
      expect(studentRepository.findStudentToSetStatus).toHaveBeenCalledWith(validPayload);
    });

    it('should throw when student not found', async () => {
      vi.mocked(sharedRepository.findUserById).mockResolvedValue(null);

      await expect(setStudentStatus(validPayload)).rejects.toThrow();
    });

    it('should throw when status update fails', async () => {
      vi.mocked(sharedRepository.findUserById).mockResolvedValue({ id: 1 } as any);
      vi.mocked(studentRepository.findStudentToSetStatus).mockResolvedValue(0);

      await expect(setStudentStatus(validPayload)).rejects.toThrow();
    });
  });

  describe('removeStudent', () => {
    it('should delete student successfully', async () => {
      vi.mocked(sharedRepository.findUserById).mockResolvedValue({ id: 1 } as any);
      vi.mocked(studentRepository.deleteStudent).mockResolvedValue(1);

      const result = await removeStudent(1);

      expect(result.message).toBe('Student deleted successfully');
      expect(studentRepository.deleteStudent).toHaveBeenCalledWith(1);
    });

    it('should throw when student not found', async () => {
      vi.mocked(sharedRepository.findUserById).mockResolvedValue(null);

      await expect(removeStudent(1)).rejects.toThrow();
    });

    it('should throw when delete fails', async () => {
      vi.mocked(sharedRepository.findUserById).mockResolvedValue({ id: 1 } as any);
      vi.mocked(studentRepository.deleteStudent).mockResolvedValue(0);

      await expect(removeStudent(1)).rejects.toThrow();
    });
  });
});

