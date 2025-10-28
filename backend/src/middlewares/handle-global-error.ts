import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils";

const handleGlobalError = (err: any, req: Request, res: Response, next: NextFunction): void => {
  console.error(err);
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({ error: err.message });
    return;
  }

  res.status(500).json({ error: "Internal server error" });
};

export { handleGlobalError };

