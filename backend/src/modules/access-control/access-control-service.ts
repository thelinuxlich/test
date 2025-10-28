import { ApiError, getAccessItemHierarchy, formatMyPermission } from "../../utils";
import { addAccessControl, updateAccessControl, deleteAccessControl, getAllAccessControls, getMyAccessControl } from "./access-control-repository";

const processAddAccessControl = async (payload: any): Promise<{ message: string }> => {
  const affectedRow = await addAccessControl(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, "Unable to add access control");
  }

  return { message: "New access control added successfully" };
};

const processUpdateAccessContorl = async (payload: any): Promise<{ message: string }> => {
  const affectedRow = await updateAccessControl(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, "Unable to update access control");
  }

  return { message: "Access control updated successfully" };
};

const processDeleteAccessControl = async (id: number): Promise<{ message: string }> => {
  const affectedRow = await deleteAccessControl(id);
  if (affectedRow <= 0) {
    throw new ApiError(500, "Unabe to delete access control");
  }

  return { message: "Access control deleted successfully" };
};

const processGetAllAccessControls = async (): Promise<any> => {
  const accessControls = await getAllAccessControls();
  if (accessControls.length <= 0) {
    throw new ApiError(404, "Access controls not found");
  }

  const hierarchialAccessControls = getAccessItemHierarchy(accessControls);
  return hierarchialAccessControls;
};

const processGetMyAccessControl = async (roleId: number): Promise<any> => {
  const permissions = await getMyAccessControl(roleId);
  if (permissions.length <= 0) {
    throw new ApiError(404, "You do not have permission to the system.");
  }
  const { hierarchialMenus, apis, uis } = formatMyPermission(permissions);
  return {
    menus: hierarchialMenus,
    apis,
    uis,
  };
};

export {
  processAddAccessControl,
  processUpdateAccessContorl,
  processDeleteAccessControl,
  processGetAllAccessControls,
  processGetMyAccessControl,
};

