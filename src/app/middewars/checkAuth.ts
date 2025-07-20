
import { JwtPayload } from 'jsonwebtoken';
import { NextFunction, Request, Response } from "express";
import { verifyToken } from '../utils/jwt';
import { envVars } from '../config/env';
import AppError from '../errorHelpers/AppError';

// Functional Hierarchy
export const checkAuth = (...authRoles: string[]) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const accessToken = req.headers.authorization

        if (!accessToken) {
            throw new AppError(403, "No token received", "")
        }

        {/* const verifiedToken = jwt.verify(accessToken, 'secret')
        *token verify function from  utils/jwt */ }
        const verifiedToken = verifyToken(accessToken, envVars.JWT_ACCESSC_SECRET) as JwtPayload

        {/**(verifiedToken as JwtPayload).role !== Role.ADMIN)
        ** checking for admin Or not*/}
        if (!authRoles.includes(verifiedToken.role)) {
            throw new AppError(403, "You are not permitted to view this", "")
        }
        console.log(verifiedToken);

        next()

    } catch (error) {
        console.log('jwt error', error);
        next(error);

    }

}