import { ApiError } from "../../utils";
import {
  getAllClasses,
  getClassDetail,
  addNewClass,
  updateClassDetailById,
  deleteClassById,
} from "./classes-repository";

interface ClassPayload {
  id?: number;
  name: string;
  sections: string;
}

const fetchAllClasses = async (): Promise<any[]> => {
  const classes = await getAllClasses();
  if (!Array.isArray(classes) || classes.length <= 0) {
    throw new ApiError(404, "Classes not found");
  }

  return classes;
};

const fetchClassDetail = async (id: number): Promise<any> => {
  const classDetail = await getClassDetail(id);
  if (!classDetail) {
    throw new ApiError(404, "Class detail not found");
  }

  return classDetail;
};

const addClass = async (payload: ClassPayload): Promise<{ message: string }> => {
  const affectedRow = await addNewClass(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, "Unable to add new class");
  }

  return { message: "Class added successfully" };
};

const updateClassDetail = async (
  payload: ClassPayload
): Promise<{ message: string }> => {
  const affectedRow = await updateClassDetailById(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, "Unable to update class detail");
  }
  return { message: "Class detail updated successfully" };
};

const deleteClass = async (id: number): Promise<{ message: string }> => {
  const affectedRow = await deleteClassById(id);
  if (affectedRow <= 0) {
    throw new ApiError(500, "Unable to delete class");
  }
  return { message: "Class deleted successfully" };
};

export {
  fetchAllClasses,
  fetchClassDetail,
  addClass,
  updateClassDetail,
  deleteClass,
};

