import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../helpers/jwtToken";
import User from "../models/user";

declare module "express-serve-static-core" {
  interface Request {
    user?: {
      email: string;
      _id: string;
    };
  }
}

export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer"))
      return next({ message: "Unauthorized", status_code: 401 });

    const token = authHeader.split(" ")[1];
    const decode = verifyToken(token);
    if (!decode) return next({ message: "Token Expired", status_code: 401 });

    const user = await User.findById(decode?._id).lean();
    if (!user) return next({ message: "No such user found", status_code: 401 });

    req.user = { email: user.email, _id: String(user._id) };
    next();
  } catch (error) {
    next({ message: "Invalid Token", status_code: 401 });
  }
}
