import { Types } from "mongoose";
import { Task } from "../models/task.model";
import { User } from "../models/user.model";
import { CreateTaskDto, UpdateTaskDto } from "../dtos/request/task.dto";
import { TaskDto } from "../dtos/response/task.dto";
import { HttpError } from "../utils/HttpError";
import { HTTP_STATUS, HTTP_MESSAGE } from "../constants/http";
import { uploadFiles, type UploadedFile } from "../utils/upload";



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

            if (attachments && attachments.length > 0) {
                uploadedFiles = await uploadFiles(attachments);
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

    async markTaskAsComplete(userId: Types.ObjectId, taskId: Types.ObjectId): Promise<TaskDto> {
        try {
            const task = await Task.findOneAndUpdate({ userId, _id: taskId }, { status: "completed" }, { new: true });
            if (!task) throw new HttpError(HTTP_MESSAGE.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
            return TaskDto.from(task);
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            console.log("Error while marking task as complete :", message);
            throw error;
        }
    }

    async updateTask(taskId: Types.ObjectId, taskData: UpdateTaskDto, attachments?: Express.Multer.File[]): Promise<TaskDto> {
        try {
            const task = await Task.findById(taskId);
            if (!task) throw new HttpError(HTTP_MESSAGE.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
            
            let uploadedFiles: UploadedFile[] = [];
            if (attachments && attachments.length > 0) {
                uploadedFiles = await uploadFiles(attachments);
            }
            const parsedExistingFiles = (taskData.existingFiles || []).map(file => 
                typeof file === 'string' ? JSON.parse(file) : file
            );
            const allAttachments = [...uploadedFiles, ...parsedExistingFiles];
            console.log("all attachments : ", allAttachments);
            const updatedTask = await Task.findByIdAndUpdate(
                taskId,
                { ...taskData, attachments: allAttachments },
                { new: true }
            );
            if (!updatedTask) throw new HttpError(HTTP_MESSAGE.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
            console.log("updated task : ", updatedTask);
            console.log("recieved task id : ", taskId);
            return TaskDto.from(updatedTask);
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            console.log("Error while updating task :", message);
            throw error;
        }
    }

    async deleteTask(userId: Types.ObjectId, taskId: Types.ObjectId): Promise<TaskDto> {
        try {
            const task = await Task.findOneAndUpdate({ userId, _id: taskId }, { isDeleted: true }, { new: true });
            if (!task) throw new HttpError(HTTP_MESSAGE.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
            return TaskDto.from(task);
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            console.log("Error while deleting task :", message);
            throw error;
        }
    }

    async restoreTask(userId: Types.ObjectId, taskId: Types.ObjectId): Promise<TaskDto> {
        try {
            const task = await Task.findOneAndUpdate({ userId, _id: taskId }, { isDeleted: false }, { new: true });
            if (!task) throw new HttpError(HTTP_MESSAGE.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
            return TaskDto.from(task);
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            console.log("Error while restoring task :", message);
            throw error;
        }
    }

    async deleteTaskPermanently(userId: Types.ObjectId, taskId: Types.ObjectId): Promise<void> {
        try {
            await Task.findOneAndDelete({ userId, _id: taskId });
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            console.log("Error while deleting task permanently :", message);
            throw error;
        }
    }

    async getDashboardTasksStats(userId: Types.ObjectId): Promise<{ total: number, pending: number, inProgress: number, completed: number }> {
        try {
            const totalTasks = await Task.countDocuments({ userId, isDeleted: { $ne: true } });
            const pendingTasks = await Task.countDocuments({ userId, isDeleted: { $ne: true }, status: "pending" });
            const inProgressTasks = await Task.countDocuments({ userId, isDeleted: { $ne: true }, status: "in-progress" });
            const completedTasks = await Task.countDocuments({ userId, isDeleted: { $ne: true }, status: "completed" });
            return { total: totalTasks, pending: pendingTasks, inProgress: inProgressTasks, completed: completedTasks };
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            console.log("Error while getting dashboard tasks stats :", message);
            throw error;
        }
    }

    async getAnalyticsData(userId: Types.ObjectId): Promise<{
        statusData: { name: string; value: number }[];
        priorityData: { name: string; value: number }[];
        weeklyData: { day: string; completed: number; created: number }[];
        completionRate: number;
        tasksThisWeek: number;
        avgCompletionTime: number;
    }> {
        try {
            const baseFilter = { userId, isDeleted: { $ne: true } };

            // Get status distribution
            const statusCounts = await Task.aggregate([
                { $match: baseFilter },
                { $group: { _id: "$status", count: { $sum: 1 } } }
            ]);

            const statusData = [
                { name: 'Pending', value: statusCounts.find(s => s._id === 'pending')?.count || 0 },
                { name: 'In Progress', value: statusCounts.find(s => s._id === 'in-progress')?.count || 0 },
                { name: 'Completed', value: statusCounts.find(s => s._id === 'completed')?.count || 0 },
            ];

            // Get priority distribution
            const priorityCounts = await Task.aggregate([
                { $match: baseFilter },
                { $group: { _id: "$priority", count: { $sum: 1 } } }
            ]);

            const priorityData = [
                { name: 'Low', value: priorityCounts.find(p => p._id === 'low')?.count || 0 },
                { name: 'Medium', value: priorityCounts.find(p => p._id === 'medium')?.count || 0 },
                { name: 'High', value: priorityCounts.find(p => p._id === 'high')?.count || 0 },
            ];

            // Get weekly data (last 7 days)
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

            const weeklyData = await Task.aggregate([
                { $match: { ...baseFilter, createdAt: { $gte: oneWeekAgo } } },
                {
                    $group: {
                        _id: {
                            day: { $dayOfWeek: "$createdAt" },
                            status: "$status"
                        },
                        count: { $sum: 1 }
                    }
                },
                {
                    $group: {
                        _id: "$_id.day",
                        completed: {
                            $sum: {
                                $cond: [{ $eq: ["$_id.status", "completed"] }, "$count", 0]
                            }
                        },
                        created: { $sum: "$count" }
                    }
                },
                { $sort: { _id: 1 } }
            ]);

            // Format weekly data with day names
            const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const formattedWeeklyData = Array.from({ length: 7 }, (_, i) => {
                const dayData = weeklyData.find(w => w._id === i + 1);
                return {
                    day: dayNames[i],
                    completed: dayData?.completed || 0,
                    created: dayData?.created || 0
                };
            });

            // Calculate completion rate
            const totalTasks = statusData.reduce((sum, status) => sum + status.value, 0);
            const completedTasks = statusData.find(s => s.name === 'Completed')?.value || 0;
            const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

            // Calculate tasks this week
            const tasksThisWeek = formattedWeeklyData.reduce((sum, day) => sum + day.created, 0);

            // Calculate average completion time (in days)
            const completedTasksWithTimes = await Task.find({
                ...baseFilter,
                status: 'completed',
                updatedAt: { $exists: true }
            }).select('createdAt updatedAt');

            let avgCompletionTime = 0;
            if (completedTasksWithTimes.length > 0) {
                const totalTime = completedTasksWithTimes.reduce((sum, task) => {
                    const timeDiff = task.updatedAt.getTime() - task.createdAt.getTime();
                    return sum + (timeDiff / (1000 * 60 * 60 * 24)); // Convert to days
                }, 0);
                avgCompletionTime = Math.round((totalTime / completedTasksWithTimes.length) * 10) / 10; // Round to 1 decimal
            }

            return {
                statusData,
                priorityData,
                weeklyData: formattedWeeklyData,
                completionRate,
                tasksThisWeek,
                avgCompletionTime
            };
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            console.log("Error while getting analytics data :", message);
            throw error;
        }
    }
}