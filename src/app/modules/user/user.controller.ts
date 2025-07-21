/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import httpStatus from 'http-status-codes';
import { UserServices } from "./user.service";
// import AppError from "../../errorHelpers/AppError";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { verifyToken } from "../../utils/jwt";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";



// const createUser = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         // throw new Error('testing err instaceOf Error form globalErrorHandler')
//         throw new AppError(httpStatus.BAD_REQUEST, "testing err instaceOf AppError form globalErrorHandler", '')
//         const user = await UserServices.createUser(req.body)

//         res.status(httpStatus.CREATED).json({
//             message: 'user created successfully',
//             user
//         })
//     }


//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     catch (err: any) {
//         // throw new Error('testing global error stack')

//         console.log(err);

//         // res.status(httpStatus.BAD_REQUEST).json({
//         //     message: `somthind went wrong ${err.message}`,
//         //     err
//         // })
//         next(err)

//     }
// }

//Alternative

const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserServices.createUser(req.body)

    // res.status(httpStatus.CREATED).json({
    //     message: 'user created successfully',
    //     user
    // })

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "User created successfully",
        data: user
    })
});

const updateUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id

    // const token = req.headers.authorization
    // const verifiedToken = verifyToken(token as string, envVars.JWT_ACCESSC_SECRET) as JwtPayload

    const payload = req.body

    const verifiedToken = req.user

    const user = await UserServices.updateUser(userId, payload, verifiedToken)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User updated successfully",
        data: user
    })
})

const getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // const users =  await UserServices.getAllUsers()
    const result = await UserServices.getAllUsers()

    // res.status(httpStatus.OK).json({
    //     success : true,
    //     message: "All users retrieved successfully",
    //     data: users
    // })

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "All users retrieved successfully",
        meta: result.meta,
        data: result.data,
    })
})

export const UserControllers = {
    createUser,
    getAllUsers,
    updateUser
}