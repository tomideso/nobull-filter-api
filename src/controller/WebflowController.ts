import { NextFunction, Request, Response, Router } from "express";
import { WebflowServiceImpl } from "@/services/WebflowService";
import TYPES from "@/config/types";
import container from "../container/inversify.config";
import { AppError } from "@/ErrorHandler/AppError";

export default () => {
  const WebflowService = container.get<WebflowServiceImpl>(
    TYPES.WebflowService
  );
  const router = Router();

  router.get(
    "/sites",
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const sites = await WebflowService.listSites();
        console.log(JSON.stringify(sites));

        res.send(sites);
      } catch (error) {
        console.log(error);
        const err = new AppError("Error getting sites list", 400);
        return next(err);
      }
    }
  );

  router.get(
    "/site-domain/:id",
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const domains = await WebflowService.getSiteDomains(
          undefined,
          req.params.id
        );
        console.log("domains", domains);

        res.send(domains);
      } catch (error) {
        res.send(error);

        const err = new AppError("Error getting domain list", 400);
        return next(err);
      }
    }
  );

  router.get(
    "/site/:id",
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const collections = await WebflowService.listCollections(
          undefined,
          req.params.id
        );
        res.send(collections);
      } catch (error) {
        const err = new AppError("Error getting collections list", 400);
        return next(err);
      }
    }
  );

  router.get(
    "/collection/:id",
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const collection = await WebflowService.getCollection(
          undefined,
          req.params.id
        );
        res.send(collection);
      } catch (error) {
        const err = new AppError("Error getting collection details", 400);
        return next(err);
      }
    }
  );

  router.get(
    "/items/:id",
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const items = await WebflowService.getCollectionItems(
          undefined,
          req.params.id
        );
        res.send(items);
      } catch (error) {
        console.log(error);
        const err = new AppError("Error getting collection items", 400);
        return next(err);
      }
    }
  );

  return router;
};
