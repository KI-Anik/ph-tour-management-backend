
import { NextFunction, Request, Response } from "express";
import { verifyToken } from '../utils/jwt';
import { envVars } from '../config/env';
import AppError from '../errorHelpers/AppError';
import httpStatus from 'http-status-codes';

// Functional Hierarchy
export const checkAuth = (...authRoles: string[]) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const accessToken = req.headers.authorization

        if (!accessToken) {
            throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized!")
        }

        {/* const verifiedToken = jwt.verify(accessToken, 'secret')
        *token verify function from  utils/jwt */ }
        const verifiedToken = verifyToken(accessToken, envVars.JWT_ACCESS_SECRET)

        if (typeof verifiedToken === 'string' || !verifiedToken.role) {
            throw new AppError(httpStatus.UNAUTHORIZED, "Invalid access token");
        }

        {/**(verifiedToken as JwtPayload).role !== Role.ADMIN)
        ** checking for admin Or not*/}
        if (!authRoles.includes(verifiedToken.role)) {
            throw new AppError(httpStatus.FORBIDDEN, "You do not have permission to perform this action.")
        }

        req.user = verifiedToken
        next()

    } catch (error) {
        console.log('jwt error', error);
        next(error);

    }

}


// -----------------------------------------


// export const checkaAuth = (...authRoles : string[]) => catchAsync(async(req : Request, res : Response, next : NextFunction)=>{
//     const accessToken = req.headers.authorization

//     if(!accessToken){
//         throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized")
//     }

//     const verifiedToken = verifyToken(accessToken, envVars.JWT_ACCESS_SECRET) as JwtPayload

//     if(!authRoles.includes(verifiedToken.role)){
//         throw new AppError(httpStatus.FORBIDDEN, "You do not have permission to perform this action.")
//     }


//     req.user = verifiedToken

//     sendResponse(res, {
//         data: req.user,
//         message: 'jwt error',
//         statusCode: httpStatus.ACCEPTED,
//         success: true
//     })
// })