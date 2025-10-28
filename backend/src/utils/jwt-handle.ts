import jwt from "jsonwebtoken";
import { ApiError } from "./api-error";

const generateToken = (payload: any, secret: string, time: string | number): string => {
  return jwt.sign(payload, secret, { expiresIn: time } as any);
};

const verifyToken = (token: string, secret: string): any => {
  try {
    return jwt.verify(token, secret);
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      throw new ApiError(400, "Token expired");
    }
    return null;
  }
};

export {
  generateToken,
  verifyToken,
};

