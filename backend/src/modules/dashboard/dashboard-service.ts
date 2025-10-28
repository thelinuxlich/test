import { ApiError } from "../../utils";
import { getUserDashboardData } from "./dashboard-repository";

const fetchDashboardData = async (id: number): Promise<any> => {
  const data = await getUserDashboardData(id);

  if (!data) {
    throw new ApiError(404, "Dashboard data not found");
  }

  return data;
};

export {
  fetchDashboardData,
};

