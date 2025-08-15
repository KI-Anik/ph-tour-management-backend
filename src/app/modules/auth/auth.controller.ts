/* eslint-disable @typescript-eslint/no-unused-vars */
import httpStatus from 'http-status-codes';
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { AuthServices } from './auth.service';
import AppError from '../../errorHelpers/AppError';

const credentialsLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const loginInfo = await AuthServices.credentialsLogin(req.body)

    res.cookie("accessToken", loginInfo.accessToken, {
        httpOnly: true,
        secure: false
    })

    res.cookie("refreshToken", loginInfo.refreshToken, {
        httpOnly: true,
        secure: false
    })

    sendResponse(res, {
        statusCode: httpStatus.ACCEPTED,
        success: true,
        message: 'Logged in Successful',
        data: loginInfo

    })
})

const getNewAccessToken = catchAsync(async(req: Request, res: Response, next: NextFunction)=>{
    const refreshToken = req.cookies.refreshToken
    if(!refreshToken){
        throw new AppError(httpStatus.BAD_REQUEST, "NO refresh token received from cookies")
    }
    
    const tokenInfo = await AuthServices.getNewAccessToken(refreshToken)

    sendResponse(res,{
        statusCode: httpStatus.ACCEPTED,
        success: true,
        message: 'new access token created',
        data: tokenInfo
    } )
})

export const AuthControllers = {
    credentialsLogin,
    getNewAccessToken
}