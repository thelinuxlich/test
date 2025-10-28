import { ApiError } from "../../utils";
import { getAllSections, getSectionById, updateSectionById, deleteSectionById, addNewSection } from "./section-repository";

const processGetAllSections = async (): Promise<any[]> => {
  const sections = await getAllSections();
  if (sections.length <= 0) {
    throw new ApiError(404, "Sections not found");
  }

  return sections;
};

const processAddNewSection = async (name: string): Promise<{ message: string }> => {
  const affectedRow = await addNewSection(name);
  if (affectedRow <= 0) {
    throw new ApiError(500, "Unable to add new section");
  }

  return { message: "Section added successfully" };
};

const processGetSectionById = async (id: number): Promise<any> => {
  const section = await getSectionById(id);
  if (!section) {
    throw new ApiError(404, "Section does not exist");
  }

  return section;
};

const processUpdateSectionById = async (payload: any): Promise<{ message: string }> => {
  const affectedRow = await updateSectionById(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, "Unable to update section detail");
  }

  return { message: "Section updated successfully" };
};

const processDeleteSectionById = async (id: number): Promise<{ message: string }> => {
  const affectedRow = await deleteSectionById(id);
  if (affectedRow <= 0) {
    throw new ApiError(500, "Unable to delete section detail");
  }

  return { message: "Section deleted successfully" };
};

export {
  processGetAllSections,
  processGetSectionById,
  processUpdateSectionById,
  processDeleteSectionById,
  processAddNewSection,
};

