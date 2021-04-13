import AuthController from "@/controller/AuthController";
import UserController from "@/controller/UserProfileController";
import { Router, Application } from "express";
import * as passport from "passport";
import OAuthController from "@/controller/OAuthController";
import AccountController from "@/controller/AccountController";
import ConfigurationController from "@/controller/ConfigurationController";
import WebflowController from "@/controller/WebflowController";
import FilterController from "@/controller/FilterController";

const publicRoutes = [
  {
    route: "/account",
    controller: AuthController,
  },
  {
    route: "/oauth",
    controller: OAuthController,
  },
  {
    route: "/config",
    controller: ConfigurationController,
  },
  {
    route: "/webflow",
    controller: WebflowController,
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
];

export const registerRoutes = (app: Application): void => {
  const routesV1 = Router();

  publicRoutes.map(({ route, controller }) => {
    routesV1.use(route, controller());
  });

  privateRoutes.map(({ route, controller }) => {
    routesV1.use(
      route,
      passport.authenticate("jwt", { session: false }),
      controller()
    );
  });

  app.use("/v1", routesV1);
};
