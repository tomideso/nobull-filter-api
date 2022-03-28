import { getUserProfile } from "@/services/AuthService";
import { extractTokenFromHeaderAsBearerToken } from "@/utility/utility";
import { Request, Response, NextFunction } from "express";
const jwt = require("jsonwebtoken");

export const fetUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const access_token = extractTokenFromHeaderAsBearerToken(req);

  try {
    const user = await getUserProfile(access_token);
    res.send(user);
  } catch (e) {
    next(e);
  }
};
