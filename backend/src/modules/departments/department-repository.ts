import { processDBRequest } from "../../utils";

interface DepartmentPayload {
  id?: number;
  name: string;
}

const getAllDepartments = async (): Promise<any[]> => {
  const query = "SELECT * FROM departments";
  const { rows } = await processDBRequest({ query, queryParams: [] });
  return rows;
};

const addNewDepartment = async (name: string): Promise<number> => {
  const query = "INSERT INTO departments(name) VALUES ($1)";
  const queryParams = [name];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

const getDepartmentById = async (id: number): Promise<any> => {
  const query = "SELECT * FROM departments WHERE id = $1";
  const queryParams = [id];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows[0];
};

const updateDepartmentById = async (payload: DepartmentPayload): Promise<number> => {
  const { id, name } = payload;
  const query = `
    UPDATE departments
      SET name = $1
    WHERE id = $2
  `;
  const queryParams = [name, id];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

const deleteDepartmentById = async (id: number): Promise<number> => {
  const query = `DELETE FROM departments WHERE id = $1`;
  const queryParams = [id];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

export {
  getAllDepartments,
  getDepartmentById,
  updateDepartmentById,
  deleteDepartmentById,
  addNewDepartment,
};

