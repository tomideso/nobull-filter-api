import AuthController from "@/controller/AuthController";
import UserController from "@/controller/UserProfileController";
import { Router, Application } from "express";
import OAuthController from "@/controller/OAuthController";
import AccountController from "@/controller/AccountController";
import ConfigurationController from "@/controller/ConfigurationController";
import WebflowController from "@/controller/WebflowController";
import FilterController from "@/controller/FilterController";
import * as cors from "cors";
import { checkUser } from "@/middleware/checkUser";

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
  // methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

const publicRoutes = [
  {
    route: "/auth",
    controller: AuthController,
  },
  {
    route: "/oauth",
    controller: OAuthController,
  },

  {
    route: "/filter",
    controller: FilterController,
  },
];

const privateRoutes = [
  {
    route: "/user",
    controller: UserController,
  },
  {
    route: "/account",
    controller: AccountController,
  },
  {
    route: "/webflow",
    controller: WebflowController,
  },
  {
    route: "/config",
    controller: ConfigurationController,
  },
];

export const registerRoutes = (app: Application): void => {
  const routesV1 = Router();

  publicRoutes.map(({ route, controller }) => {
    routesV1.use(route, controller());
  });

  privateRoutes.map(({ route, controller }) => {
    routesV1.use(route, checkUser, controller());
  });

  app.use("/v1", cors(corsOptions), routesV1);
};
