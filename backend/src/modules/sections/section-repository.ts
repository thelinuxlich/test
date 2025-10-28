import { processDBRequest } from "../../utils";

interface SectionPayload {
  id?: number;
  name: string;
}

const getAllSections = async (): Promise<any[]> => {
  const query = "SELECT * FROM sections";
  const { rows } = await processDBRequest({ query, queryParams: [] });
  return rows;
};

const addNewSection = async (name: string): Promise<number> => {
  const query = "INSERT INTO sections(name) VALUES ($1)";
  const queryParams = [name];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

const getSectionById = async (id: number): Promise<any> => {
  const query = "SELECT * FROM sections WHERE id = $1";
  const queryParams = [id];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows[0];
};

const updateSectionById = async (payload: SectionPayload): Promise<number> => {
  const { id, name } = payload;
  const query = `
    UPDATE sections
      SET name = $1
    WHERE id = $2
  `;
  const queryParams = [name, id];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

const deleteSectionById = async (id: number): Promise<number> => {
  const query = `DELETE FROM sections WHERE id = $1`;
  const queryParams = [id];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

export {
  getAllSections,
  getSectionById,
  updateSectionById,
  deleteSectionById,
  addNewSection,
};

