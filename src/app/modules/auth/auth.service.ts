import bcrypt from 'bcryptjs';
import httpStatus from 'http-status-codes';
import AppError from "../../errorHelpers/AppError"
import { IUser } from "../user/user.interface"
import { User } from "../user/user.model"
// import jwt from 'jsonwebtoken';
import { createNewAccessTokenWithRefreshToken, createUserTokens } from '../../utils/userTokens';

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
    const newAccessToken = await createNewAccessTokenWithRefreshToken(refreshToken)

    return{
        accessToken : newAccessToken
    }
}



export const AuthServices = {
    credentialsLogin,
    getNewAccessToken
}