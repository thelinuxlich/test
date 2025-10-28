import axios from "axios";
import { API_URL, API_HEADERS } from "../../constants";
import { apiErrorHandler } from "../../utils/apiErrorHandler";

let rpcNode: any = null;
let initialized = false;

const initializeHandler = async (): Promise<void> => {
  if (initialized) return;
  initialized = true;
  try {
    const response = await axios.get(API_URL, {
      headers: API_HEADERS,
    });
    rpcNode = response.data;
  } catch (error: any) {
    apiErrorHandler(error.response?.data || error.message);
  }
};

// Call the initialization
initializeHandler();

// Export a higher-order function that wraps the module exports
const departmentModuleHandler = (moduleFactory: () => any): any => {
  if (!initialized) {
    initializeHandler();
  }
  return moduleFactory();
};

export { departmentModuleHandler };

