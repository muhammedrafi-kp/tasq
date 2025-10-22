import { Types } from "mongoose";
import { Task } from "../models/task.model";
import { User } from "../models/user.model";
import { CreateTaskDto } from "../dtos/request/task.dto";
import { TaskDto } from "../dtos/response/task.dto";
import { HttpError } from "../utils/HttpError";
import { HTTP_STATUS, HTTP_MESSAGE } from "../constants/http";
import cloudinary from "../configs/cloudinary";
import streamifier from "streamifier";

interface UploadedFile {
    filename: string;
    url: string;
}

function getResourceType(mimetype: string): "image" | "raw" {
    if (mimetype.startsWith("image/")) return "image";
    return "raw"; // PDFs, DOCX, etc.
}


export class TaskService {
    constructor() { };

    async createTask(userId: Types.ObjectId, taskData: CreateTaskDto, attachments?: Express.Multer.File[]): Promise<TaskDto> {
        try {

            let assignedTo: { userId: Types.ObjectId; email: string }[] = [];

            if (taskData.assignedTo && taskData.assignedTo.length > 0) {
                let assignedList = taskData.assignedTo;

                for (const email of assignedList) {
                    const user = await User.findOne({ email });
                    if (user) {
                        assignedTo.push({ userId: user._id, email: user.email });
                    } else {
                        console.warn(`⚠️ No user found with email: ${email}`);
                    }
                }
            }

            let uploadedFiles: UploadedFile[] = [];
            console.log("userId in create task service: ", userId);
            if (attachments && attachments.length > 0) {
                const uploadPromises: Promise<UploadedFile>[] = attachments.map(file => {
                    return new Promise<UploadedFile>((resolve, reject) => {

                        const resourceType = getResourceType(file.mimetype);

                        const stream = cloudinary.uploader.upload_stream(
                            { folder: "tasq/task/attachments", resource_type: resourceType },
                            (error, result) => {
                                if (error) return reject(error);
                                if (!result || !result.secure_url) return reject(new Error("Upload failed"));
                                resolve({ filename: file.originalname, url: result.secure_url });
                            }
                        );

                        streamifier.createReadStream(file.buffer).pipe(stream);
                    });
                });

                uploadedFiles = await Promise.all(uploadPromises);
            }
            console.log("uploaded files :", uploadedFiles);
            const task = new Task({
                ...taskData,
                userId,
                attachments: uploadedFiles,
                assignedTo,
            });
            await task.save();
            return TaskDto.from(task);
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            console.log("Error while creating task :", message);
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

    async getTasks(userId: Types.ObjectId, queryParams: {
        page?: number;
        limit?: number;
        search?: string;
        status?: string;
        priority?: string;
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
    } = {}): Promise<{ tasks: TaskDto[]; totalCount: number; totalPages: number; currentPage: number }> {
        try {
            const {
                page = 1,
                limit = 9,
                search = '',
                status = '',
                priority = '',
                sortBy = 'createdAt',
                sortOrder = 'desc'
            } = queryParams;

            const filter: any = { userId, isDeleted: { $ne: true } };

            if (search) {
                filter.$or = [
                    { title: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } }
                ];
            }

            if (status && status !== 'all') {
                filter.status = status;
            }

            if (priority && priority !== 'all') {
                filter.priority = priority;
            }

            const sort: any = {};
            sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

            const skip = (page - 1) * limit;

            const totalCount = await Task.countDocuments(filter);

            const tasks = await Task.find(filter)
                .sort(sort)
                .skip(skip)
                .limit(limit);

            const totalPages = Math.ceil(totalCount / limit);

            return {
                tasks: TaskDto.fromList(tasks),
                totalCount,
                totalPages,
                currentPage: page
            };
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