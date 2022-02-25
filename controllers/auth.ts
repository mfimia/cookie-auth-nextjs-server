import { Request, Response } from "express";
import jwt, { Secret } from "jsonwebtoken";
import { Document } from "mongodb";
import User from "../models/user";
import { comparePassword, hashPassword } from "../utils/auth";

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

export const loginUser = async (
  req: Request,
  res: Response
): Promise<Response<Document | { success: boolean; payload: string }>> => {
  try {
    const { email, password } = await req.body;

    const user: Document = await User.findOne({ email }).exec();
    if (!user)
      return res.status(400).send({ success: false, payload: "Invalid email" });

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid)
      return res
        .status(400)
        .send({ success: false, payload: "Wrong password" });

    const token = jwt.sign(
      { _id: user._id },
      process.env.JWT_SECRET as Secret,
      { expiresIn: "7d" }
    );

    user.password = undefined;

    res.cookie("token", token, {
      httpOnly: true,
      // secure: true
    });

    return res.json(user);
  } catch (err) {
    return res
      .status(400)
      .send({ success: false, payload: "Error. Try again" });
  }
};

export const logoutUser = async (
  _: Request,
  res: Response
): Promise<Response<{ success: boolean; payload: string }>> => {
  try {
    res.clearCookie("token");
    return res.status(200).send({ succes: true, payload: "Goodbye!" });
  } catch (err) {
    return res.send({ success: false, payload: "Server error" });
  }
};

export const currentUser = async (
  req: Request,
  res: Response
): Promise<Response<{ ok: boolean }>> => {
  try {
    await User.findById(req.user!._id).select("-password").exec();
    return res.json({ ok: true });
  } catch (err) {
    console.log("failed");
    return res.json({ ok: false });
  }
};
