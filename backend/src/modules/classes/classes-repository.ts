import { processDBRequest } from "../../utils";

interface ClassPayload {
  id?: number;
  name: string;
  sections: string;
}

const getAllClasses = async (): Promise<any[]> => {
  const query = "SELECT * FROM classes ORDER BY name";
  const { rows } = await processDBRequest({ query, queryParams: [] });
  return rows;
};

const getClassDetail = async (id: number): Promise<any> => {
  const query = "SELECT * from classes WHERE id = $1";
  const { rows } = await processDBRequest({ query, queryParams: [id] });
  return rows[0];
};

const addNewClass = async (payload: ClassPayload): Promise<number> => {
  const { name, sections } = payload;
  const query = `
    INSERT INTO classes (name, sections)
    VALUES ($1, $2)
  `;
  const queryParams = [name, sections];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

const updateClassDetailById = async (payload: ClassPayload): Promise<number> => {
  const { id, name, sections } = payload;
  const query = `
    UPDATE classes
    SET name = $1, sections = $2
    WHERE id = $3
  `;
  const queryParams = [name, sections, id];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

const deleteClassById = async (id: number): Promise<number> => {
  const query = "DELETE FROM classes WHERE id = $1";
  const queryParams = [id];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

export {
  getAllClasses,
  getClassDetail,
  addNewClass,
  updateClassDetailById,
  deleteClassById,
};

