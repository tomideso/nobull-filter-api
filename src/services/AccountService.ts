import Account from "../entity/Account";
import AccountRepository from "../Repository/AccountRepository";
import { injectable, inject } from "inversify";
import TYPES from "../config/types";
import { Redis } from "ioredis";
import { AppError } from "@/ErrorHandler/AppError";
import { CustomResponse } from "@/ErrorHandler/CustomResponse";

@injectable()
export class AccountServiceImpl implements AccountService {
  private accountRepo: AccountRepository;

  private redisClient: Redis;

  constructor(
    @inject(TYPES.Redis) redisClient: Redis,
    @inject(TYPES.AccountRepo) accountRepo
  ) {
    this.redisClient = redisClient;
    this.accountRepo = accountRepo;
  }

  public async getUser(id: string) {}
}

export interface AccountService {
  getUser(userId);
}
