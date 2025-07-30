import bcrypt from 'bcryptjs';
import httpStatus from 'http-status-codes';
import AppError from "../../errorHelpers/AppError"
import { IsActive, IUser } from "../user/user.interface"
import { User } from "../user/user.model"
// import jwt from 'jsonwebtoken';
import { generateToken, verifyToken } from '../../utils/jwt';
import { envVars } from '../../config/env';
import { createUserTokens } from '../../utils/userTokens';
import { JwtPayload } from 'jsonwebtoken';

const credentialsLogin = async (payload: Partial<IUser>) => {
    const { email, password } = payload

    const isUserExist = await User.findOne({ email })

    if (!isUserExist) {
        throw new AppError(httpStatus.FORBIDDEN, "Email doesn't exist", "")
    }

    const isPasswordMatched = await bcrypt.compare(password as string, isUserExist?.password as string)

    if (!isPasswordMatched) {
        throw new AppError(httpStatus.FORBIDDEN, "Incorrect password", "")
    }

    const userTokens = createUserTokens(isUserExist)

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: pass, ...rest } = isUserExist.toObject()
    //removed password from response/frontend

    return {
        accessToken: userTokens.accessToken,
        refreshToken: userTokens.refreshToken,
        user: rest
    }

}

const getNewAccessToken = async (refreshToken: string) => {
    const verifiedToken = verifyToken(refreshToken, envVars.JWT_REFRESH_SECRET) as JwtPayload

    const isUserExist = await User.findOne({ email: verifiedToken.email })
    if (!isUserExist) {
        throw new AppError(httpStatus.NOT_FOUND, "User does not exist")
    }

    if (isUserExist.isActive === IsActive.BLOCKED || isUserExist.isActive === IsActive.INACTIVE) {
        throw new AppError(httpStatus.BAD_REQUEST, `User is ${isUserExist.isActive}`)
    }

    if (isUserExist.isDeleted) {
        throw new AppError(httpStatus.BAD_REQUEST, "User is deleted")
    }

    const jwtPayload = {
        userId: isUserExist._id,
        email: isUserExist.email,
        role: isUserExist.role
    }

    const accessToken = generateToken(jwtPayload, envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRES)

    return{
        accessToken
    }
}



export const AuthServices = {
    credentialsLogin,
    getNewAccessToken
}