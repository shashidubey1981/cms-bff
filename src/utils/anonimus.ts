import { v4 as uuidv4 } from "uuid";
import { Request, Response } from "express";

export const getOrCreateAnonId = (req: Request, res: Response) => {
  let anonId = uuidv4();
  return anonId;
}