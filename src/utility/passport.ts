import * as passport from "passport";
import Account from "../entity/Account";
import { JWT_CONFIG as CONFIG } from "../config/index";
import { injectable, inject } from "inversify";
import { Request } from "express";
import TYPES from "../config/types";
import { Redis } from "ioredis";

const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

// Setup JWT options
const opts = {
  secretOrKey: CONFIG.jwtSecret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  passReqToCallback: true,
};

export interface Passport {
  init(): void;
}

@injectable()
export class PassportImpl implements Passport {
  private options: any;

  private redisClient: Redis;

  constructor(@inject(TYPES.Redis) redisClient: Redis) {
    this.options = {
      secretOrKey: CONFIG.jwtSecret,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      passReqToCallback: true,
    };
    this.redisClient = redisClient;
  }

  init() {
    passport.use(
      new JwtStrategy(this.options, async (req: Request, jwtPayload, done) => {
        //If the token has expired, raise unauthorized
        const expirationDate = new Date(jwtPayload.exp * 1000);

        if (expirationDate < new Date()) {
          return done(null, false);
        }

        //checks if token has been revoked manually
        const token = req.headers.authorization.split(" ")[1];

        const found = await this.redisClient.get(token);

        if (found) {
          return done(null, false, "Invalid Token");
        }

        //    const account = await Account.findOneOrFail({ email: jwtPayload.email })
        //     .catch(error=>null)

        //     if(account){
        //         return done(null, account);
        //     }

        return done(null, false, "Invalid Token");
      })
    );
  }
}
