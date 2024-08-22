import { NextFunction, Request, Response } from "express";
import HttpService from "../HttpService";

const httpService = new HttpService("https://jsonplaceholder.typicode.com/");

export async function fetchDataFromAnotherService(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const data = await httpService.get("todos/?limit=20");
    res.json(data);
  } catch (error) {
    next(error);
  }
}
