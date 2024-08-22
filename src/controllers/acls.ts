// Packages
import { NextFunction, Request, Response } from "express";

// Models
import User from "../models/user";

import { ADMIN } from "../constants/defaultKeys";

export async function getUsers(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { role } = req.user || {};
    if (role !== ADMIN) return next({ message: "Forbidden", status_code: 403 });

    const users = await User.find();

    res.status(200).json({ users });
  } catch (error) {
    next(error);
  }
}
