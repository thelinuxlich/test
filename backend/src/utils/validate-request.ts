import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

const validateRequest = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction): void => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params
    });

    next();
  } catch (error: any) {
    const formattedErrors = error.errors.map((err: any) => ({
      path: err.path.join('.'),
      message: err.message,
    }));

    res.status(400).json({
      error: "Validation error",
      detail: formattedErrors
    });
  }
};

export { validateRequest };

