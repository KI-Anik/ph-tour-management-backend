import bcrypt from 'bcryptjs';
import httpStatus from 'http-status-codes';
import AppError from "../../errorHelpers/AppError"
import { IUser } from "../user/user.interface"
import { User } from "../user/user.model"
import jwt from 'jsonwebtoken';

const credentialsLogin = async (payload: Partial<IUser>) => {
    const { email, password } = payload

    const isUserExist = await User.findOne({ email })

    if (!isUserExist) {
        throw new AppError(httpStatus.FORBIDDEN, "Email doesn't exist")
    }

    const isPasswordMatched = await bcrypt.compare(password as string, isUserExist?.password as string)

    if (!isPasswordMatched) {
        throw new AppError(httpStatus.FORBIDDEN, "Incorrect password")
    }

    const jwtPayload = {
        userId: isUserExist._id,
        email: isUserExist.email,
        role: isUserExist.role
    }

    const accessToken = jwt.sign(jwtPayload, 'secret', {
        expiresIn: "1d"
    })

    return {
        accessToken
    }

} 

export const AuthServices = {
    credentialsLogin
}