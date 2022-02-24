import { Request, Response } from "express";
import { Document } from "mongodb";
import User from "../models/user";
import { hashPassword } from "../utils/auth";

export const registerUser = async (
  req: Request,
  res: Response
): Promise<Response<{ success: boolean; payload: string | Document }>> => {
  try {
    const {
      name,
      email,
      password,
    }: { name: string; email: string; password: string } = await req.body;

    if (!name)
      return res
        .status(400)
        .send({ success: false, payload: "Name is required" });

    if (!password || password.length < 6)
      return res.status(400).send("Invalid password");

    const isEmailInUse = !!(await User.findOne({ email }).exec());
    if (isEmailInUse)
      return res
        .status(400)
        .send({ success: false, payload: "Email already in use" });

    const hashedPassword: string | unknown = await hashPassword(password);

    const user: Document = await new User({
      name,
      email,
      password: hashedPassword,
    }).save();

    return res.status(200).json({ success: true, payload: user });
  } catch (err) {
    return res
      .status(400)
      .send({ success: false, payload: "Error. Try again" });
  }
};
