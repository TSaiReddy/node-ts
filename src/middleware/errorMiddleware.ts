import { Request, Response, NextFunction } from "express";
import { writeLog } from "../logger/logger";

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

  writeLog("error", err.message);

  return res.status(status).json({ message: errorMessage });
};
