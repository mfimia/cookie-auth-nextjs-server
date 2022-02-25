import { Request, Response } from "express";
import expressJwt, { secretType, RequestHandler, Options } from "express-jwt";

export const requireSignIn: RequestHandler = expressJwt({
  getToken: (req: Request, _: Response) => req.cookies.token,
  secret: process.env.JWT_SECRET as secretType,
  algorithms: ["HS256"],
} as Options);
