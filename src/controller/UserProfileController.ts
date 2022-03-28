import { NextFunction, Request, Response, Router } from "express";
import Account from "../entity/Account";
// import { checkRole } from "../middleware/checkRole";

export default () => {
  let router = Router();

  // router.get(
  //   "/all",
  //   // checkRole(["superadmin"]),
  //   async (req: Request, res: Response, next: NextFunction) => {
  //     const users = await Account.find().catch((err) =>
  //       res.status(409).send("Invalid request.")
  //     );

  //     return res.send({ users });
  //   }
  // );

  // router.get(
  //   "/:id",
  //   async (req: Request, res: Response, next: NextFunction) => {
  //     const user = await Account.findOneOrFail(req.params.id).catch((err) =>
  //       res.send("Cannot find users")
  //     );
  //     res.send(user);
  //   }
  // );

  // router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  //   const { firstName, lastName, age, account } = req.body;
  //   const userObject = { firstName, lastName, age, account };

  //   const user = await Account.create(userObject)
  //     .save()
  //     .catch((err) => res.send("Error creating user."));

  //   return res.send(user);
  // });

  // router.delete(
  //   "/:id",
  //   // checkRole(["superadmin"]),
  //   async (req: Request, res: Response, next: NextFunction) => {
  //     const user = await Account.findOneOrFail(req.params.id).catch((err) =>
  //       res.send("User with such id does not exist")
  //     );

  //     await this.userRepository.remove(user);

  //     return res.send("User deleted successfully");
  //   }
  // );

  return router;
};
