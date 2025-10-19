import { Types } from "mongoose";
import { TaskService } from "../services/task.service"
import { Request, Response } from "express";
import { HTTP_STATUS, HTTP_MESSAGE } from "../constants/http";
import { HttpError } from "../utils/HttpError";

export class TaskController {
    constructor(private _taskService: TaskService) { };

    async createTask(req: Request, res: Response) {
        try {
            console.log("got it")
            const taskData = req.body;
            console.log("recieved task data : ", taskData);
            const task = await this._taskService.createTask(taskData);
            res.status(200).json({ success: true, message: "ok" });
        } catch (error: unknown) {
            if (error instanceof HttpError) {
                console.info(`HTTP Error: ${error.status} - ${error.message}`);
                res.status(error.status).json({ success: false, message: error.message });
            } else {
                console.error('Unexpected error:', error);
                res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success: false, message: HTTP_MESSAGE.INTERNAL_SERVER_ERROR })
            }
        }
    }

    async getTask(req: Request, res: Response) {
        try {
            console.log("got it")
            const taskId = new Types.ObjectId(req.params.taskId);
            if (!taskId) {
                return res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, message: HTTP_MESSAGE.TASK_ID_REQUIRED });
            }
            const task = await this._taskService.getTask(taskId);
            console.log("recieved task id : ", taskId);
            res.status(HTTP_STATUS.OK).json({ success: true, message: HTTP_MESSAGE.OK, data: task });
        } catch (error: unknown) {
            if (error instanceof HttpError) {
                console.info(`HTTP Error: ${error.status} - ${error.message}`);
                res.status(error.status).json({ success: false, message: error.message });
            } else {
                console.error('Unexpected error:', error);
                res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success: false, message: HTTP_MESSAGE.INTERNAL_SERVER_ERROR })
            }
        }
    }

    async getTasks(req: Request, res: Response) {
        try {
            const tasks = await this._taskService.getTasks();
            res.status(HTTP_STATUS.OK).json({ success: true, message: HTTP_MESSAGE.OK, data: tasks });
        } catch (error: unknown) {
            if (error instanceof HttpError) {
                console.info(`HTTP Error: ${error.status} - ${error.message}`);
                res.status(error.status).json({ success: false, message: error.message });
            } else {
                console.error('Unexpected error:', error);
                res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success: false, message: HTTP_MESSAGE.INTERNAL_SERVER_ERROR })
            }
        }
    }

    async updateTask(req: Request, res: Response) {
        try {
            console.log("got it")
            const taskId = req.params;
            console.log("recieved task id : ", taskId);
            res.status(200).json({ success: true, message: "ok" });
        } catch (error: unknown) {
            if (error instanceof HttpError) {
                console.info(`HTTP Error: ${error.status} - ${error.message}`);
                res.status(error.status).json({ success: false, message: error.message });
            } else {
                console.error('Unexpected error:', error);
                res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success: false, message: HTTP_MESSAGE.INTERNAL_SERVER_ERROR })
            }
        }
    }

    async deleteTask(req: Request, res: Response) {
        try {
            console.log("got it")
            const taskId = req.params;
            console.log("recieved task id : ", taskId);
            res.status(200).json({ success: true, message: "ok" });
        } catch (error: unknown) {
            if (error instanceof HttpError) {
                console.info(`HTTP Error: ${error.status} - ${error.message}`);
                res.status(error.status).json({ success: false, message: error.message });
            } else {
                console.error('Unexpected error:', error);
                res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success: false, message: HTTP_MESSAGE.INTERNAL_SERVER_ERROR })
            }
        }
    }

}