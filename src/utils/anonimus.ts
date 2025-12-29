import { v4 as uuidv4 } from "uuid";
import { Request, Response } from "express";

export const getOrCreateAnonId = (req: Request, res: Response) => {
  const cookieName = "cs-personalize-user-uid";

  let anonId ;
  console.log('anonId', anonId)
    anonId = uuidv4();
    res.cookie(cookieName, anonId, {
      httpOnly: false,        // JS needs to read it
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 1000 * 60 * 60 * 24 * 365 // 1 year
    });


  return anonId;
}