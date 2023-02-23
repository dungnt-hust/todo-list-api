// import { config } from "../config"
// import {ErrorCode, Utils, SendEmail, logger, OtpType, OtpWay,} from "../utils";
// // import { Redis } from "../databases";
// import { UserModel } from '../models'
//
// export class OTPController {
//     public static async send_otp(otpType: OtpType, otpWay: OtpWay, id: string) {
//         let _otpType: string = OtpType[otpType].toLowerCase();
//         let _otpWay: string = OtpWay[otpWay].toLowerCase();
//         const key = ['code', _otpType, _otpWay, id.trim().toLowerCase()].join('-');
//         let obj_code: any = await Redis.defaultCli.get(key);
//         if (obj_code) {
//             obj_code = JSON.parse(obj_code);
//             if (obj_code.time_create + 60000 > Date.now())
//                 throw ErrorCode.TOO_MANY_REQUEST;
//         }
//
//         let otp_code = Utils.generateCode();
//         let obj = {
//             code: otp_code,
//             time_create: Date.now()
//         }
//
//         await Redis.defaultCli.set(key, JSON.stringify(obj), 'ex', 300);
//         logger.debug(key, otp_code);
//
//
//         switch (otpType) {
//             case OtpType.VERIFY_EMAIL: {
//                 if(otpWay == OtpWay.EMAIL) {
//                     await SendEmail.verify_email({
//                         email: id,
//                         code: otp_code
//                     })
//                 }
//                 break;
//             }
//         }
//     };
//
//     public static async verify_otp(otpType: OtpType, otpWay: OtpWay, id: string, code: string) {
//         let _otpType: string = OtpType[otpType].toLowerCase();
//         let _otpWay: string = OtpWay[otpWay].toLowerCase();
//         const key = ['code', _otpType, _otpWay, id.trim().toLowerCase()].join('-');
//
//         let objCode: any = await Redis.defaultCli.get(key);
//         if (!objCode)
//             throw ErrorCode.OTP_INVALID_OR_EXPIRED;
//         objCode = JSON.parse(objCode);
//
//         if (objCode.time_create + 300000 < Date.now() || objCode.code != code)
//             throw ErrorCode.OTP_INVALID_OR_EXPIRED;
//
//         await Redis.defaultCli.del(key);
//     };
//
// }
