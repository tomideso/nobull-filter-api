import { Container } from "inversify";
import TYPES from "../config/types";
import { Redis } from "ioredis";
import { Redis as RedisClient } from "../config/redis";
import { Passport, PassportImpl } from "../utility/passport";
import { UserServiceImpl, UserService } from "@/services/UserService";
import {
  ConfigurationServiceImpl,
  ConfigurationService,
} from "@/services/ConfigurationService";
import { WebflowServiceImpl, WebflowService } from "@/services/WebflowService";
import { FilterServiceImpl, FilterService } from "@/services/FilterService";

const container = new Container();
container.bind<Redis>(TYPES.Redis).toConstantValue(RedisClient());
container.bind<Passport>(TYPES.Passport).to(PassportImpl);
container.bind<UserService>(TYPES.UserService).to(UserServiceImpl);
container.bind<FilterService>(TYPES.FilterService).to(FilterServiceImpl);
container
  .bind<ConfigurationService>(TYPES.ConfigurationService)
  .to(ConfigurationServiceImpl);
container.bind<WebflowService>(TYPES.WebflowService).to(WebflowServiceImpl);

export default container;
