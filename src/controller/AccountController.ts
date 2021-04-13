import { NextFunction, Request, Response, Router } from "express";
import { checkRole } from "../middleware/checkRole";
import container from "@/container/inversify.config";
import TYPES from "@/config/types";

export default () => {
  // const HospitalService = container.get<HospitalServiceImpl>(
  //   TYPES.HospitalService
  // );
  const router = Router();

  router.get(
    "/whoami",
    async (req: Request, res: Response, next: NextFunction) => {
      const { user } = req as any;
      console.log((<any>req).user);
      res.send(user);
    }
  );

  router.post(
    "/whoami",
    async (req: Request, res: Response, next: NextFunction) => {
      const { user } = req as any;
      console.log((<any>req).body);
      res.send(user);
    }
  );

  return router;
};
