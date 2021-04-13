
import { Request, Response, NextFunction } from "express";


export const checkRole = (roles: Array<string>) => {
   
  return async (req: Request, res: Response, next: NextFunction) => {

  //Get the user ID from previous midleware
    //req.user courtesy of passportjs
    const currentUser = (<any>req).user;

    //Check if array of authorized roles includes the user's roles
    const check=currentUser.roles.filter(role=>roles.includes(role));
    return check.length ? next() : res.status(401).send("You are not Authorized");

  };
};