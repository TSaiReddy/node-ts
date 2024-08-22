// Packages
import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";

// Models
import User from "../models/user";

import { loginValidator, signupValidator } from "../validators/user";
import AuthService from "../helpers/AuthService";

export async function login(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { email, password } = await loginValidator.validateAsync(req.body);

    const user = await User.findOne({ email });
    if (!user)
      return next({
        message: "We could not find an account with the email you provided.",
        status_code: 400,
      });

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword)
      return next({
        status_code: 400,
        message: "Email / Password were incorrect",
      });

    //Creating JWT Access Token
    const access_token = AuthService.generateToken({
      _id: String(user._id),
      email: user.email,
    });

    res.status(200).json({ access_token });
  } catch (error) {
    next(error);
  }
}

export async function register(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { first_name, last_name, email, password, role } =
      await signupValidator.validateAsync(req.body);

    const user = await User.findOne({ email });
    if (user) return next({ status_code: 400, message: "Email Already Exist" });

    const hashedPassword = await AuthService.hashPassword(password);
    const newUser = new User({
      password: hashedPassword,
      first_name,
      last_name,
      email,
      role,
    });

    const savedUser = await newUser.save();

    const access_token = AuthService.generateToken({
      _id: String(savedUser._id),
      email: savedUser.email,
    });

    res.status(200).json({ access_token });
  } catch (error) {
    next(error);
  }
}
