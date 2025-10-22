import { Types } from "mongoose";
import { TaskService } from "../services/task.service"
import { Request, Response } from "express";
import { HTTP_STATUS, HTTP_MESSAGE } from "../constants/http";
import { HttpError } from "../utils/HttpError";
import { CreateTaskDto, UpdateTaskDto } from "../dtos/request/task.dto";

export class TaskController {
    constructor(private _taskService: TaskService) { };

    async createTask(req: Request, res: Response) {
        try {
            const userId = new Types.ObjectId(req.user?.userId);
            const taskData: CreateTaskDto = req.body;
            const attachments = req.files as Express.Multer.File[];

            const task = await this._taskService.createTask(userId, taskData, attachments);
            res.status(HTTP_STATUS.CREATED).json({ success: true, message: HTTP_MESSAGE.OK, data: task });
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
            const taskId = new Types.ObjectId(req.params.taskId);

            if (!taskId) {
                return res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, message: HTTP_MESSAGE.TASK_ID_REQUIRED });
            }

            const task = await this._taskService.getTask(taskId);

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
            const userId = new Types.ObjectId(req.user?.userId);
            const {
                page = 1,
                limit = 9,
                search = '',
                status = '',
                priority = '',
                sortBy = 'createdAt',
                sortOrder = 'desc'
            } = req.query;

            const queryParams = {
                page: parseInt(page as string) || 1,
                limit: parseInt(limit as string) || 9,
                search: search as string,
                status: status as string,
                priority: priority as string,
                sortBy: sortBy as string,
                sortOrder: sortOrder as 'asc' | 'desc'
            };

            const result = await this._taskService.getTasks(userId, queryParams);
            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: HTTP_MESSAGE.OK,
                data: result.tasks,
                pagination: {
                    totalCount: result.totalCount,
                    totalPages: result.totalPages,
                    currentPage: result.currentPage,
                    limit: queryParams.limit
                }
            });
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
            const taskId = new Types.ObjectId(req.params.taskId);
            const taskData: UpdateTaskDto = req.body;
            const attachments = req.files as Express.Multer.File[]
            console.log("recieved task id : ", taskId);
            console.log("recieved task data : ", taskData);
            console.log("recieved attachments :", req.files);
            const task = await this._taskService.updateTask(taskId, taskData, attachments);
            res.status(HTTP_STATUS.OK).json({ success: true, message: HTTP_MESSAGE.OK, data: task   });
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
            const userId = new Types.ObjectId(req.user?.userId);
            const taskId = new Types.ObjectId(req.params.taskId);

            if (!userId || !taskId) {
                return res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, message: HTTP_MESSAGE.TASK_ID_REQUIRED });
            }
            await this._taskService.deleteTask(userId, taskId);
            res.status(HTTP_STATUS.OK).json({ success: true, message: HTTP_MESSAGE.OK });
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

    async deleteTaskPermanently(req: Request, res: Response) {
        try {
            const userId = new Types.ObjectId(req.user?.userId);
            const taskId = new Types.ObjectId(req.params.taskId);

            if (!userId || !taskId) {
                return res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, message: HTTP_MESSAGE.TASK_ID_REQUIRED });
            }
            await this._taskService.deleteTaskPermanently(userId, taskId);
            res.status(HTTP_STATUS.OK).json({ success: true, message: HTTP_MESSAGE.OK });
        } catch (error: unknown) {
            console.error('Unexpected error:', error);
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success: false, message: HTTP_MESSAGE.INTERNAL_SERVER_ERROR })
        }
    }

    async markTaskAsComplete(req: Request, res: Response) {
        try {
            const userId = new Types.ObjectId(req.user?.userId);
            const taskId = new Types.ObjectId(req.params.taskId);
            if (!userId || !taskId) {
                return res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, message: HTTP_MESSAGE.TASK_ID_REQUIRED });
            }
            await this._taskService.markTaskAsComplete(userId, taskId);
            res.status(HTTP_STATUS.OK).json({ success: true, message: HTTP_MESSAGE.OK });
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

    async getDashboardTasksStats(req: Request, res: Response) {
        try {
            const userId = new Types.ObjectId(req.user?.userId);
            console.log("recieved userId : ", userId);
            if (!userId) {
                return res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, message: HTTP_MESSAGE.TASK_STATS_REQUIRED });
            }
            const stats = await this._taskService.getDashboardTasksStats(userId);
            console.log("recieved stats : ", stats);
            res.status(HTTP_STATUS.OK).json({ success: true, message: HTTP_MESSAGE.OK, data: stats });
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

    async getAnalyticsData(req: Request, res: Response) {
        try {
            const userId = new Types.ObjectId(req.user?.userId);

            if (!userId) {
                return res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, message: HTTP_MESSAGE.TASK_STATS_REQUIRED });
            }
            const analyticsData = await this._taskService.getAnalyticsData(userId);
            console.log("recieved analytics data : ", analyticsData);
            res.status(HTTP_STATUS.OK).json({ success: true, message: HTTP_MESSAGE.OK, data: analyticsData });
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