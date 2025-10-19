import { ITask } from "../../models/task.model";

export class TaskDto {
    public readonly id: string;
    public readonly userId: string;
    public readonly title: string;
    public readonly description?: string;
    public readonly createdAt: Date;
    public readonly dueDate?: Date;
    public readonly status: string;
    public readonly priority: string;
    public readonly assignedTo?: string;
    public readonly tags?: string[];
    public readonly isDeleted?: boolean;

    constructor(task: ITask) {
        this.id = task._id.toString();
        this.userId = task.userId.toString();
        this.title = task.title;
        this.description = task.description;
        this.status = task.status;
        this.priority = task.priority;
        this.dueDate = task.dueDate;
        this.assignedTo = task.assignedTo;
        this.tags = task.tags;
        this.createdAt = task.createdAt;
        this.isDeleted = task.isDeleted;
    }

    static from(task: ITask): TaskDto {
        return new TaskDto(task);
    }

    static fromList(tasks: ITask[]): TaskDto[] {
        return tasks.map(task => new TaskDto(task));
    }
}