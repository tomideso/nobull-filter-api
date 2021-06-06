import { NextFunction, Request, Response, Router } from "express";
import { FilterServiceImpl } from "@/services/FilterService";
import TYPES from "@/config/types";

import container from "../container/inversify.config";
import { AppError } from "@/ErrorHandler/AppError";

export default () => {
  const FilterService = container.get<FilterServiceImpl>(TYPES.FilterService);
  const router = Router();

  router.get("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const configuration = await FilterService.generateClientConfig();
      res.send(configuration);
    } catch (error) {
      console.log(error);
      const err = new AppError("Error getting collections list", 400);
      return next(err);
    }
  });

  router.get(
    "/:id",
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const configuration = await FilterService.generateClientConfig(
          req.params.id
        );
        res.send(configuration);
      } catch (error) {
        console.log(error);
        const err = new AppError("Error getting collections list", 400);
        return next(err);
      }
    }
  );

  router.post(
    "/:id",
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const configID = req.params.id;
        const query = req.body.filterQuery;
        const filterCollection: string = req.body.filterCollection;

        const entries = Object.entries(query);

        // console.log(entries, filterCollection);

        let resultSet: Array<string> = [];

        for (const [filterGroupID, filterElements] of entries) {
          const results = (<Array<string>>filterElements).map(
            async (filterElementID) => {
              console.log({ filterGroupID, filterElementID });

              return await FilterService.initFilter({
                configID,
                filterCollection,
                filterElementID,
                filterGroupID,
              });
            }
          );

          const matchedSlugs = await Promise.all(results).catch((err) => []);

          resultSet = [...new Set(resultSet.concat(...matchedSlugs))];
        }

        return res.send(resultSet);
      } catch (error) {
        console.log(error);
        const err = new AppError("Error performing filter", 400);
        return next(err);
      }
    }
  );

  return router;
};
