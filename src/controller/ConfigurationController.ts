import { NextFunction, Request, Response, Router } from "express";
import { ConfigurationServiceImpl } from "@/services/ConfigurationService";
import TYPES from "@/config/types";

import container from "../container/inversify.config";
import { AppError } from "@/ErrorHandler/AppError";

export default () => {
  const ConfigurationService = container.get<ConfigurationServiceImpl>(
    TYPES.ConfigurationService
  );
  const router = Router();

  router.post(
    "/create",
    async (req: Request, res: Response, next: NextFunction) => {
      const { config } = req.body;
      console.log(JSON.stringify(config));
      try {
        const configuration = await ConfigurationService.create(config);
        res.send(configuration);
      } catch (error) {
        console.error(error);
        const err = new AppError("Error getting collections list", 400);
        return next(err);
      }
    }
  );

  router.put(
    "/:id",
    async (req: Request, res: Response, next: NextFunction) => {
      const { config } = req.body;
      try {
        const configuration = await ConfigurationService.update(
          req.params.id,
          config
        );
        res.send(configuration);
      } catch (error) {
        const err = new AppError("Error saving configuration list", 400);
        return next(err);
      }
    }
  );

  router.put(
    "/classname/:id",
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const config = await ConfigurationService.updateActiveClassName(
          req.params.id,
          req.body
        );
        // console.log(config);
        res.send(config);
      } catch (error) {
        return next(error);
      }
    }
  );

  router.get("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const configuration = await ConfigurationService.getAll();
      res.send(configuration);
    } catch (error) {
      console.log(error);
      const err = new AppError("Error getting collections list", 400);
      return next(err);
    }
  });

  return router;
};
