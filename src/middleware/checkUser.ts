import { Request, Response, NextFunction } from "express";
const jwt = require("jsonwebtoken");

export const checkUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies?.token;

  if (token) {
    jwt.verify(token, process.env.SECRET_KEY, async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        res.clearCookie("token");

        return res.status(401).send("You are not Authorized");
      }

      const user = decodedToken.user;
      res.locals.user = user;

      next();
    });
  } else {
    res.locals.user = null;

    res.clearCookie("token");
    res.status(401).send("You are not Authorized");
  }
};
