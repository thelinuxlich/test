import { Request, Response, NextFunction } from "express";
import { env } from "../config";
import { ApiError, verifyToken, generateCsrfHmacHash } from "../utils";

const csrfProtection = (req: Request, res: Response, next: NextFunction): void => {
  const csrfToken = req.headers["x-csrf-token"];
  const accessToken = req.cookies.accessToken;

  if (!csrfToken || typeof csrfToken !== "string") {
    throw new ApiError(400, "Invalid csrf token");
  }

  const decodedAccessToken = verifyToken(
    accessToken,
    env.JWT_ACCESS_TOKEN_SECRET || ""
  );
  if (!decodedAccessToken || !decodedAccessToken.csrf_hmac) {
    throw new ApiError(400, "Invalid csrf token");
  }

  const hmacHashedCsrf = generateCsrfHmacHash(csrfToken);
  if (decodedAccessToken.csrf_hmac !== hmacHashedCsrf) {
    throw new ApiError(403, "Forbidden. CSRF token mismatch");
  }

  next();
};

export { csrfProtection };

