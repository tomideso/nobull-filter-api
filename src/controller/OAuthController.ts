import { NextFunction, Request, Response, Router } from "express";
import { JWT_CONFIG } from "../config";
import { refreshToken } from "../services/OAuthService";
import container from "../container/inversify.config";
import { Redis } from "ioredis";
import TYPES from "../config/types";


export default () => {

    const Redis = container.get<Redis>(TYPES.Redis)
    const router = Router();

    router.post('/revoke', async (req: Request, res: Response, next: NextFunction) => {

        const { refresh_token, access_token } = req.body;

        if (!access_token || !refresh_token) {
            return res.status(400).send({
                message: 'access_token and refresh_token are required in request body',
                error: "Invalid request"
            });
        }

        Redis.setex(access_token, JWT_CONFIG.token_expiration, access_token);
        Redis.del(refresh_token);

        return res.send({message:'Token Revoked',error:null})

    });


    router.post('/refresh', async (req: Request, res: Response, next: NextFunction) => {

        const { refresh_token, email } = req.body;


        if (!refresh_token || !email) {
            return res.status(400).send('refresh_token & email are required')
        }

        try {
            const token = await refreshToken(req.body);
            return res.send(token)
        }
        catch (e) {
            res.status(400).send(e);
        }

    });


    return router;
}
