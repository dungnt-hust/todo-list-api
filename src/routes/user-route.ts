import {Application, json, Request, Response, Router} from "express"
import {ErrorCode, hpr, OtpWay, routeResSuccess} from "../utils"
import Joi from "joi";
import {UserController} from "../controllers";
import {checkAuth} from "../middlewares";
import {config} from "../config";
import {AuthController} from "../controllers/auth.controller";

let Busboy = require('busboy')
const { v4: uuidv4 } = require('uuid');
let S3 = require('aws-sdk/clients/s3');
const BUCKET = config.s3.bucket;
const ACCESS_KEY = config.s3.access_key
const SECRET_KEY = config.s3.secret_key
const REGION = config.s3.region

const get = async (req: Request, res: Response) => {
    const data = await Joi.object()
        .keys({})
        .validateAsync(req.query)

    return routeResSuccess(res, await UserController.get(res.locals.userId));
}

const hello = async (req: Request, res: Response) => {
    return res.status(200).json({
        message: "ok bay by"
    })
}

const upload = async (req: Request, res: Response) => {
    try {

        let chunks: any = [];
        let file_name: any = null;
        let mime_type: any = null;
        const options = {
            accessKeyId: ACCESS_KEY,
            secretAccessKey: SECRET_KEY,
            region: REGION,
        }
        let s3 = new S3(options)
        var busboy = new Busboy({ headers: req.headers })
        busboy.on('file', function (
            fieldname: any,
            file: any,
            filename: any,
            encoding: any,
            mimetype: any
        ) {
            console.log(
                'File [' +
                fieldname +
                ']: filename: ' +
                filename +
                ', encoding: ' +
                encoding +
                ', mimetype: ' +
                mimetype
            )
            file_name = filename
            mime_type = mimetype
            file.on('data', function (data: any) {
                console.log(
                    'File [' +
                    fieldname +
                    '] got ' +
                    data.length +
                    ' bytes'
                )
                chunks.push(data)
            })
            file.on('end', function () {
                console.log('File [' + fieldname + '] Finished')
            })
        })
        busboy.on('field', function (
            fieldname: any,
            val: any,
            fieldnameTruncated: any,
            valTruncated: any,
            encoding: any,
            mimetype: any,
        ) {
            console.log(
                'Field [' + fieldname + ']: value: ' + (val)
            )
        })
        busboy.on('finish', function () {
            console.log('Done parsing form!')
            const params = {
                Bucket: BUCKET,
                Key: uuidv4() + file_name,
                Body: Buffer.concat(chunks), // concatinating all chunks
                ACL: 'public-read',
                ContentType: mime_type,
            }
            s3.upload(params, function (err: any, data: any) {
                if (err) {
                    console.log(
                        'There was an error uploading your file: ',
                        err
                    )
                    throw ErrorCode.UNKNOWN_ERROR
                }
                console.log(
                    'Successfully uploaded file.',
                    data.Location
                )
                return routeResSuccess(res, data.Location);
            })
        })
        req.pipe(busboy)
    } catch (e) {
        throw ErrorCode.UNKNOWN_ERROR
    }


}

export const UserRoute = (app: Application) => {
    const router = Router();
    app.use("/user", router);

    router.get("/get", checkAuth, hpr(get));
    router.post("/upload", hpr(upload));
    router.get("/hello", hpr(hello))
}
