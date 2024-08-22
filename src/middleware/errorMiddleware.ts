import { Request, Response, NextFunction } from "express";

function getStatus(err: any): number {
  if (err.code === 11000) return 409;
  if (err.isJoi) return 422;
  if (err?.name === "ValidationError") return 400;
  return err.status_code || err.status || 500;
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const status = getStatus(err);
  const errorMessage = err.message || "Internal Server Error";

  return res.status(status).json({ message: errorMessage });
};
