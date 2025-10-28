import { Request, Response, NextFunction } from "express";
import { env } from "../config";
import { verifyToken, ApiError } from "../utils";

const handlePasswordSetupToken = (req: Request, res: Response, next: NextFunction): void => {
  const { token } = req.body;
  if (!token) {
    throw new ApiError(404, "Invalid token");
  }

  const decodeToken = verifyToken(token, env.PASSWORD_SETUP_TOKEN_SECRET || "");
  if (!decodeToken || !decodeToken.id) {
    throw new ApiError(400, "Invalid token");
  }

  req.user = decodeToken;
  next();
};

export { handlePasswordSetupToken };

