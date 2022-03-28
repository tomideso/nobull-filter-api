import Account from "../entity/Account";

import { AppError } from "@/ErrorHandler/AppError";

import HttpClient from "./HttpClient";
import Axios from "axios";

const RequestHandler = Axios.create({
  baseURL: process.env.SSO_BASE_URL,
  timeout: 5000,
  headers: { "Content-Type": "application/json" },
});

export const getAccessTokenFromAuthCode = async (
  code
): Promise<authResponse> => {
  try {
    const { token, user } = await RequestHandler.post<authResponse>(
      "/auth/authcode",
      { code }
    ).then(({ data }) => data);

    const { firstName, lastName, email, _id } = user;

    //Todo
    //add all free products to user subscription

    await Account.findOneAndUpdate(
      { userId: user.id },
      { userId: _id, firstName, lastName, email, accessToken: token.token },
      { upsert: true }
    );

    token.access_token = token.token;
    token.refresh_token = token.refreshToken;

    return { token, user };
  } catch (e) {
    throw new AppError("Error getting Access token", 401);
  }
};

export const getUserProfile = async (access_token): Promise<authResponse> => {
  try {
    const user = await RequestHandler.get<authResponse>("/users/profile", {
      headers: {
        Authorization: "Bearer " + access_token,
      },
    }).then(({ data }) => data);
    return user;
  } catch (e) {
    throw new AppError("Error getting user profile", 401);
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

interface authResponse {
  user: ssoUser;
  token: access_token;
}

interface ssoUser {
  status: string;
  _id: string;
  __v: string;
  firstName: string;
  lastName: string;
  email: string;
  userCode: string;
  confirmationCode: string;
  refreshToken: string;
  fullName: string;
  id: string;
}

interface access_token {
  expiresIn: number;
  token: string;
  refreshToken: string;
  refresh_token: string;
  access_token?: string;
}
