import { Request, Response } from "express";
import expressJwt, { secretType } from "express-jwt";

export const requireSignIn = expressJwt({
  getToken: (req: Request, _: Response) => req.cookies.token,
  secret: process.env.JWT_SECRET as secretType,
  algorithms: ["HS256"],
} as any);
