import { processDBRequest } from "../../utils";

const getUserDashboardData = async (userId: number): Promise<any> => {
  const query = `SELECT * FROM get_dashboard_data($1)`;
  const queryParams = [userId];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows[0].get_dashboard_data;
};

export {
  getUserDashboardData,
};

