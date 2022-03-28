import { NextFunction, Request, Response, Router } from "express";
import { getAccessTokenFromAuthCode } from "@/services/AuthService";

import { AppError } from "@/ErrorHandler/AppError";
import { CustomResponse } from "@/ErrorHandler/CustomResponse";
import { checkUser } from "@/middleware/checkUser";
import { fetUserProfile } from "@/middleware/fetchUserProfile";

const jwt = require("jsonwebtoken");

export default () => {
  const router = Router();

  // router.post("/login", Login);

  router.post(
    "/authorize",
    async (req: Request, res: Response, next: NextFunction) => {
      const { code: userCode } = req.body;
      console.log({ userCode });

      if (!userCode) {
        const err = new AppError("userCode is required", 400);
        return next(err);
      }

      try {
        const { user, token } = await getAccessTokenFromAuthCode(userCode);

        const {
          refreshToken,
          userCode: code,
          confirmationCode,
          __v,
          ...rest
        } = user;

        // console.log(user);

        // set cookie
        const cookie = signCookie(
          { email: user.email, token: token.access_token },
          token.expiresIn
        );

        res.cookie("token", cookie, {
          httpOnly: true,
          // domain: "localhost",
          // sameSite: "lax",
          maxAge: token.expiresIn * 1000,
        });

        res.send(user);
      } catch (e) {
        console.log(e);
        return next(e);
      }
    }
  );

  router.get("/profile", fetUserProfile);

  router.get("/whoami", checkUser, async (req, res, next) => {
    res.send(res.locals?.user?.user);
  });

  router.post("/logout", async (req, res, next) => {
    res.locals.user = null;
    res.locals.token = null;

    res.status(200).clearCookie("token", {
      httpOnly: true,
    });

    res.send(CustomResponse("User logged out successfully..", 200));
  });

  return router;
};

const signCookie = (id, maxAge) => {
  return jwt.sign({ id }, process.env.SECRET_KEY, {
    expiresIn: maxAge,
  });
};
