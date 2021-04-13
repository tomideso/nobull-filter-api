import Account from "../entity/Account";
import { Request, Response, NextFunction } from "express";
import { generateAccessToken } from "../middleware/auth";
import { AppError } from "@/ErrorHandler/AppError";
import { Redis } from "ioredis";
import container from "@/container/inversify.config";
import TYPES from "@/config/types";
import { UserService, UserServiceImpl } from "./UserService";
import { CustomResponse } from "@/ErrorHandler/CustomResponse";
import HttpClient from "./HttpClient";

export const getAccessTokenFromAuthCode = async (code): Promise<string> => {
  try {
    const token = await new HttpClient(null).getAccessToken(code);
    return token.access_token;
  } catch (e) {
    throw new AppError("Error getting Access token", 400);
  }
};

export const getAccessTokenInfo = async (access_token): Promise<string> => {
  const restClient = new HttpClient(access_token);
  try {
    return restClient.get("/info?api_version=1.0.0");
  } catch (e) {
    throw new AppError("Error getting Access token", 400);
  }
};
