import { Request, Response } from "express";
import { generateAccessToken as getAccessToken } from '../services/OAuthService';


export const generateAccessToken = (req: Request, res: Response) => {

    const access_token=getAccessToken((<any>req).user)

    return res.status(200).json(access_token);
}
