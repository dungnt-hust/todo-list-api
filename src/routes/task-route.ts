import Joi from "joi";
import {Application, Request, Response, Router} from "express"
import {hpr, routeResSuccess, Utils} from "../utils";
import {TaskController} from "../controllers";

const get = async (req: Request, res: Response) => {
    const {task_id} = await Joi.object()
        .keys({
            task_id: Joi.number().integer().required()
        })
        .validateAsync({...req.query, ...req.params, ...req.body});

    return routeResSuccess(res, await TaskController.get(task_id));
}

const create = async (req: Request, res: Response) => {
    const data = await Joi.object()
        .keys({
            name: Joi.string().required(),
            description: Joi.string().required()
        })
        .validateAsync({...req.query, ...req.params, ...req.body});

    data.status = 1;
    return routeResSuccess(res, await TaskController.create(data));
}
const update = async (req: Request, res: Response) => {
    const data = await Joi.object()
        .keys({
            id: Joi.string().required(),
            description: Joi.string(),
            name: Joi.string(),
            status: Joi.number()
        })
        .validateAsync({...req.query, ...req.params, ...req.body});

    return routeResSuccess(res, await TaskController.update(data));
}
const list = async (req: Request, res: Response) => {

    return routeResSuccess(res, await TaskController.list());
}

const deleteTask = async (req: Request, res: Response) => {
    const data = await Joi.object()
        .keys({
            task_id: Joi.number().required()
        })
        .validateAsync({...req.query, ...req.params, ...req.body});

    return routeResSuccess(res, await TaskController.delete(data.task_id));
}

export const TaskRoute = (app: Application) => {
    const taskRouter = Router();
    app.use("/task", taskRouter);

    taskRouter.get("/get", hpr(get));
    taskRouter.get("/list", hpr(list));
    taskRouter.put("/delete", hpr(deleteTask));
    taskRouter.put("/update", hpr(update));
    taskRouter.post("/create", hpr(create));
}
