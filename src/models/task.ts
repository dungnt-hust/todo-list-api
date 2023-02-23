import {doQuery, sql} from "../databases";
import {TaskStatus} from "./enum/task";
import {logger} from "../utils";

const TABLE = 'tasks'

export const TaskModel = {
    get: async (taskId: number) => {
        let query: string = `select * from ${TABLE} where id = ?`;
        let [result, ignored]: any[] = await sql.query(query, [taskId]);
        logger.trace("query", query);
        return result.length ? result[0] : null;
    },

    list: async () => {
        let query: string = `select * from ${TABLE} where 1 = 1`;
        let [result, ignored]: any[] = await sql.query(query, []);
        logger.trace("query", query);
        return result.length ? result : null;
    },

    create: async (data: any) => {
        return await doQuery.insertRow(TABLE, data);
    },

    update: async (data: any) => {
        return await doQuery.updateRow(TABLE, data, data.id);
    },

    delete: async (taskId: number) => {
        return await doQuery.updateRow(TABLE, {status: TaskStatus.DELETE}, taskId);
    }
}