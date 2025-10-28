import { ApiError } from "../../utils";
import {
  getAllDepartments,
  addNewDepartment,
  getDepartmentById,
  updateDepartmentById,
  deleteDepartmentById,
} from "./department-repository";
import { departmentModuleHandler } from "./department-module";

const processGetAllDepartments = async (): Promise<any[]> => {
  const departments = await getAllDepartments();
  if (departments.length <= 0) {
    throw new ApiError(404, "Departments not found");
  }

  return departments;
};

const processAddNewDepartment = async (name: string): Promise<{ message: string }> => {
  const affectedRow = await addNewDepartment(name);
  if (affectedRow <= 0) {
    throw new ApiError(500, "Unable to add new department");
  }

  return { message: "Department added successfully" };
};

const processGetDepartmentById = async (id: number): Promise<any> => {
  const department = await getDepartmentById(id);
  if (!department) {
    throw new ApiError(404, "Department does not exist");
  }

  return department;
};

const processUpdateDepartmentById = async (payload: any): Promise<{ message: string }> => {
  const affectedRow = await updateDepartmentById(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, "Unable to update department detail");
  }

  return { message: "Department updated successfully" };
};

const processDeleteDepartmentById = async (id: number): Promise<{ message: string }> => {
  const affectedRow = await deleteDepartmentById(id);
  if (affectedRow <= 0) {
    throw new ApiError(500, "Unable to delete department detail");
  }

  return { message: "Department deleted successfully" };
};

export default departmentModuleHandler(async () => {
  return {
    processGetAllDepartments,
    processGetDepartmentById,
    processUpdateDepartmentById,
    processDeleteDepartmentById,
    processAddNewDepartment,
  };
});

