import { NextFunction, Request, Response, Router } from "express";
// import { Login } from "@/services/AuthService";
import container from "@/container/inversify.config";
import TYPES from "@/config/types";
import { AppError } from "@/ErrorHandler/AppError";
import { CustomResponse } from "@/ErrorHandler/CustomResponse";

export default () => {
  const router = Router();

  // router.post("/login", Login);

  // router.post("/verify", async (req, res, next) => {
  //   const { token } = req.body;

  //   if (!token) {
  //     const err = new AppError("token is missing in reques body", 400);
  //     return next(err);
  //   }

  //   try {
  //     const userEmail = await OTPService.verify(token);

  //     const done = await completeRegistration(userEmail);

  // res.send(CustomResponse("Account Email verification Successful",201))

  //   } catch (e) {
  //     return next(e);
  //   }
  // });

  return router;
};
