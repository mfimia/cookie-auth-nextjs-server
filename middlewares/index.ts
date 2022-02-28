import { Request, Response } from "express";
import expressJwt, { secretType, RequestHandler, Options } from "express-jwt";

// gets user information from
export const requireSignIn: RequestHandler = expressJwt({
  getToken: (req: Request, _: Response) => {
    console.log(
      "REQUEST:",
      req,
      "COOKIES:",
      req.cookies,
      "TOKEN:",
      req.cookies.token
    );
    return req.cookies.token;
  },
  secret: process.env.JWT_SECRET as secretType,
  algorithms: ["HS256"],
} as Options);
