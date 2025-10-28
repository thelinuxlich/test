import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import { checkPermission } from "../modules/roles-and-permissions/rp-repository";
import { ApiError } from "../utils";

const checkApiAccess = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { baseUrl, route: { path }, method } = req;
  const { roleId } = req.user;
  const originalUrl = `${baseUrl}${path}`;

  if (roleId !== 1) {
    const affectedRow = await checkPermission(roleId, originalUrl, method);
    if (affectedRow <= 0) {
      throw new ApiError(403, `You do not have permission to access to this resource - ${originalUrl}`);
    }
  }
  next();
});

export { checkApiAccess };

