import { Types } from "mongoose";
import { Task } from "../models/task.model";
import { CreateTaskDto } from "../dtos/request/task.dto";
import { TaskDto } from "../dtos/response/task.dto";
import { HttpError } from "../utils/HttpError";
import { HTTP_STATUS, HTTP_MESSAGE } from "../constants/http";

export class TaskService {
    constructor() { };

    async createTask(taskData: CreateTaskDto): Promise<TaskDto> {
        try {
            const task = new Task(taskData);
            task.save();
            return TaskDto.from(task);
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            console.log("Error while login user :", message);
            throw error;
        }
    }

    async getTask(taskId: Types.ObjectId): Promise<TaskDto> {
        try {
            const task = await Task.findById(taskId);

            if (!task) throw new HttpError(HTTP_MESSAGE.NOT_FOUND, HTTP_STATUS.NOT_FOUND);

            return TaskDto.from(task);

        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            console.log("Error while login user :", message);
            throw error;
        }
    }

    async getTasks(): Promise<TaskDto[]> {
        try {
            const tasks = await Task.find();
            return TaskDto.fromList(tasks);
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            console.log("Error while fetching tasks :", message);
            throw error;
        }
    }

    async updateTask(taskData: CreateTaskDto): Promise<void> {
        try {

        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            console.log("Error while login user :", message);
            throw error;
        }
    }

    async deleteTask(taskData: CreateTaskDto): Promise<void> {
        try {

        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            console.log("Error while login user :", message);
            throw error;
        }
    }
}