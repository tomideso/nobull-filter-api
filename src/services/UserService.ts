// import UserProfile from "@/entity/UserProfile";
// import UserProfile from "@/entity/UserProfile";
import { injectable, inject } from "inversify";
import TYPES from "@/config/types";
import { AppError } from "@/ErrorHandler/AppError";
import Account from "@/entity/Account";

@injectable()
export class UserServiceImpl implements UserService {
  public async create(account, { firstname, lastname, title }) {
    try {
      // const user = await UserProfile.create({
      //     firstname,
      //     lastname,
      //     title,
      //     account
      // })
      // .save()
      // return user;
    } catch (error) {
      throw new AppError("Error creating user", 400);
    }
  }
}

export interface UserService {
  //   create(account: Account, userParams): Promise<UserProfile>;
}
