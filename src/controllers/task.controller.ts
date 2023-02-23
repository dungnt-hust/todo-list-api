import {TaskModel} from "../models";
import {TaskError} from "../models/enum/task";

export class TaskController {
    public static async get(taskId: number){
        const task = await TaskModel.get(taskId);
        if (!task) throw TaskError.TASK_NOT_FOUND;
        return task;
    }

    public static async list() {
        const list = await TaskModel.list();
        return list;
    }

    public static async create(data: any) {
        return await TaskModel.create(data);
    }

    public static async update(data: any){
        return await TaskModel.update(data);
    }

    public static async delete(taskId: number){
        return await TaskModel.delete(taskId);
    }
}