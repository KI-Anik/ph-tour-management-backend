import jwt, { JwtPayload } from 'jsonwebtoken';
import { NextFunction, Request, Response, Router } from "express";
import { UserControllers } from "./user.controller";
import { createUserZodSchema } from "./user.validation";
import { validateRequest } from "../../middewars/validateRequest";
import AppError from "../../errorHelpers/AppError";
import { Role } from './user.interface';


const router = Router()

router.post('/register', validateRequest(createUserZodSchema), UserControllers.createUser)

router.get('/all-users', (req: Request, res: Response, next: NextFunction) => {
    try {
        const accessToken = req.headers.authorization

        if (!accessToken) {
            throw new AppError(403, "No token received", "")
        }

        const verifiedToken = jwt.verify(accessToken, 'secret')

        if(!verifiedToken){
            throw new AppError(403, "you are not authorized", "")
        }

        if((verifiedToken as JwtPayload).role !== Role.ADMIN){
            throw new AppError(403, "You are not permitted to view this", "")
        }
        console.log(verifiedToken);
        next()
        
    } catch (error) {
        next(error);

    }

}, UserControllers.getAllUsers)

export const UserRoutes = router