import { ITask, IAssignee, IComment, IAttachment } from "../../models/task.model";

export class TaskDto {
    public readonly id: string;
    public readonly userId: string;
    public readonly title: string;
    public readonly description?: string;
    public readonly createdAt: Date;
    public readonly dueDate: Date;
    public readonly status: string;
    public readonly priority: string;
    public readonly assignedTo?: { userId?: string; email: string }[];
    public readonly comments?: { userId?: string; email: string; text: string; createdAt: Date }[];
    public readonly attachments?: IAttachment[];
    public readonly isDeleted?: boolean;
    public readonly updatedAt: Date;

    constructor(task: ITask) {
        this.id = task._id.toString();
        this.userId = task.userId.toString();
        this.title = task.title;
        this.description = task.description;
        this.status = task.status;
        this.priority = task.priority;
        this.dueDate = task.dueDate;
        this.assignedTo = task.assignedTo?.map(a => ({
            userId: a.userId ? a.userId.toString() : undefined,
            email: a.email,
        }));
        this.comments = task.comments?.map(c => ({
            userId: c.userId ? c.userId.toString() : undefined,
            email: c.email,
            text: c.text,
            createdAt: c.createdAt,
        }));
        this.attachments = task.attachments;
        this.createdAt = task.createdAt;
        this.updatedAt = task.updatedAt;
        this.isDeleted = task.isDeleted;
    }

    static from(task: ITask): TaskDto {
        return new TaskDto(task);
    }

    static fromList(tasks: ITask[]): TaskDto[] {
        return tasks.map(task => new TaskDto(task));
    }
}