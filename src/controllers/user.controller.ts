import {UserModel} from "../models";
import {ErrorCode, OtpType, SendEmail, TokenType, UserStatus, Utils} from "../utils";
import {recoverPersonalSignature} from 'eth-sig-util'
// import {Redis} from "../databases";
import {config} from "../config";
// import {OTPController} from "./otp.controller";


export class UserController {
    public static async getByEmail (email:string) {
        return UserModel.getByType('email', email);
    };
    public static async get (userId:number) {
        const user:any = await UserModel.get(userId);
        if(!user)
            throw ErrorCode.USER_NOT_FOUND;
        return user;
    };
}
