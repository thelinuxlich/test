import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils";
import { env } from "../config";

declare global {
  namespace Express {
    interface Request {
      user?: any;
      refreshToken?: any;
    }
  }
}

const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  const accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;

  if (!accessToken || !refreshToken) {
    throw new ApiError(401, "Unauthorized. Please provide valid tokens.");
  }

  jwt.verify(accessToken, env.JWT_ACCESS_TOKEN_SECRET || "", (err: any, user: any) => {
    if (err) {
      throw new ApiError(
        401,
        "Unauthorized. Please provide valid access token."
      );
    }

    jwt.verify(
      refreshToken,
      env.JWT_REFRESH_TOKEN_SECRET || "",
      (err: any, refreshTokenData: any) => {
        if (err) {
          throw new ApiError(
            401,
            "Unauthorized. Please provide valid refresh token."
          );
        }

        req.user = user;
        req.refreshToken = refreshTokenData;
        next();
      }
    );
  });
};

export { authenticateToken };

