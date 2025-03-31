// eslint-disable-next-line
import { Request } from "express";

declare module 'express-serve-static-core' {
    interface Request {
        isTokenProvided?: boolean,
        auth_token?: string,
        isTokenValid: boolean,
        userId: string
    }
}