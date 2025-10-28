import { db } from "../config";
import { ERROR_MESSAGES } from "../constants";
import { ApiError } from "./api-error";

interface DBRequestParams {
  query: string;
  queryParams: any[];
}

const processDBRequest = async ({ query, queryParams }: DBRequestParams): Promise<any> => {
  try {
    const result = await db.query(query, queryParams);
    return result;
  } catch (error) {
    console.log(error);
    // console.error(error.message); //save this error log in db
    throw new ApiError(500, ERROR_MESSAGES.DATABASE_ERROR);
  }
};

export { processDBRequest };

