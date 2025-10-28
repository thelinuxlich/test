import { sendAccountVerificationEmail } from "../../utils";
import { assertHTTP } from "../../utils/assertHTTP";
import { goTry } from "go-go-try";
import {
  findAllStudents,
  findStudentDetail,
  findStudentToSetStatus,
  addOrUpdateStudent,
  deleteStudent,
  type StudentResponse,
  type StudentDetailResponse,
} from "./students-repository";
import { findUserById } from "../../shared/repository";

interface StudentPayload {
  [key: string]: any;
}

interface StudentStatusPayload {
  userId: number;
  reviewerId: number;
  status: boolean;
}

export const checkStudentId = async (id: number): Promise<void> => {
  const isStudentFound = await findUserById(id);
  assertHTTP(isStudentFound, "Student not found", '404');
};

export const getAllStudents = async (payload: StudentPayload): Promise<StudentResponse[]> => {
  const students = await findAllStudents(payload);
  assertHTTP(students.length > 0, "Students not found", '404');

  return students;
};

export const getStudentDetail = async (id: number): Promise<StudentDetailResponse> => {
  await checkStudentId(id);

  const student = await findStudentDetail(id);
  assertHTTP(student, "Student not found", '404');

  return student;
};

export const addNewStudent = async (
  payload: StudentPayload
): Promise<{ message: string }> => {
  const ADD_STUDENT_AND_EMAIL_SEND_SUCCESS =
    "Student added and verification email sent successfully.";
  const ADD_STUDENT_AND_BUT_EMAIL_SEND_FAIL =
    "Student added, but failed to send verification email.";

  const result = await addOrUpdateStudent(payload);
  assertHTTP(result.status, result.message, '500');

  const [emailError] = await goTry(
    sendAccountVerificationEmail({
      userId: result.userId,
      userEmail: payload.email,
    })
  );

  return {
    message: emailError
      ? ADD_STUDENT_AND_BUT_EMAIL_SEND_FAIL
      : ADD_STUDENT_AND_EMAIL_SEND_SUCCESS,
  };
};

export const updateStudent = async (
  payload: StudentPayload
): Promise<{ message: string }> => {
  const result = await addOrUpdateStudent(payload);
  assertHTTP(result.status, result.message, '500');

  return { message: result.message };
};

export const setStudentStatus = async (
  payload: StudentStatusPayload
): Promise<{ message: string }> => {
  const { userId, reviewerId, status } = payload;
  await checkStudentId(userId);

  const affectedRow = await findStudentToSetStatus({
    userId,
    reviewerId,
    status,
  });
  assertHTTP(affectedRow > 0, "Unable to disable student", '500');

  return { message: "Student status changed successfully" };
};

export const removeStudent = async (id: number): Promise<{ message: string }> => {
  await checkStudentId(id);

  const affectedRows = await deleteStudent(id);
  assertHTTP(affectedRows > 0, "Unable to delete student", '500');

  return { message: "Student deleted successfully" };
};
