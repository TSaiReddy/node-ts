import { NextFunction, Request, Response } from "express";

import User from "../models/user";

import AuthService from "../helpers/AuthService";

declare module "express-serve-static-core" {
  interface Request {
    user?: {
      email: string;
      _id: string;
      role: string;
    };
  }
}

export default class AuthMiddleware {
  static async authenticate(req: Request, res: Response, next: NextFunction) {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer"))
        return next({ message: "Unauthorized", status_code: 401 });

      const token = authHeader.split(" ")[1];
      const decodedToken = AuthService.verifyToken(token);
      if (!decodedToken)
        return next({ message: "Token Expired", status_code: 401 });

      const user = await User.findById(decodedToken._id).lean();
      if (!user)
        return next({ message: "No such user found", status_code: 401 });

      req.user = {
        email: user.email,
        _id: String(user._id),
        role: user.role,
      };

      next();
    } catch (error) {
      next(error);
    }
  }

  static authorizationHandler(roles: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {
      const { role } = req.user || {};

      if (role && roles.includes(role)) return next();

      res
        .status(403)
        .json({ message: "You're not authorized to perform this action" });
    };
  }
}
