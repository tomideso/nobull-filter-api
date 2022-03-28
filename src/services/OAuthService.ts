import Account from "../entity/Account";
import * as jwt from "jsonwebtoken";
import { JWT_CONFIG as CONFIG } from "../config/index";
import container from "../container/inversify.config";
import { Redis } from "ioredis";
import TYPES from "../config/types";
const randtoken = require("rand-token");

export const refreshToken = async ({ email, refresh_token }) => {
  const RedisClient = container.get<Redis>(TYPES.Redis);

  const found = await RedisClient.get(refresh_token).catch((err) => false);

  if (!found) {
    throw "Invalid Refresh Token";
  }

  // //Get user from database
  // try {

  //     const account = await Account.findOneOrFail({
  //         where: { email },
  //         select: ["email", "roles", "id"]
  //     });

  //     return generateAccessToken({
  //         id: account.id,
  //         email: account.email,
  //         roles: account.roles
  //     })
  // }
  //  catch (error) {
  //     throw "User not found."
  // }
};

export const generateAccessToken = (user): Access_Token => {
  const RedisClient = container.get<Redis>(TYPES.Redis);

  const { jwtSecret, token_expiration } = CONFIG;

  const refresh_token = randtoken.uid(128);

  const access_token = jwt.sign(user, jwtSecret, {
    expiresIn: token_expiration,
  });

  //RefreshToken lifetime is set to 2ice lifetime of access_token
  RedisClient.setex(refresh_token, token_expiration * 2, JSON.stringify(user));

  return {
    token_type: "bearer",
    expires_in: token_expiration,
    access_token,
    refresh_token,
  };
};

type Access_Token = {
  token_type: string;
  expires_in: number;
  access_token: string;
  refresh_token: string;
};
