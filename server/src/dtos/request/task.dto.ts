import { IsNotEmpty, IsOptional, IsEnum, IsDateString, IsArray, IsString } from "class-validator";

export class CreateTaskDto {
  @IsNotEmpty({ message: "Title is required." })
  title!: string;

  @IsOptional()
  description?: string;

  @IsEnum(["pending", "in-progress", "completed"], { message: "Status must be pending, in-progress, or completed." })
  @IsOptional()
  status?: "pending" | "in-progress" | "completed";

  @IsEnum(["low", "medium", "high"], { message: "Priority must be low, medium, or high." })
  @IsOptional()
  priority?: "low" | "medium" | "high";

  @IsOptional()
  @IsArray({ message: "AssignedTo must be an array of email strings." })
  @IsString({ each: true })
  assignedTo?: string[] | string;

  @IsDateString({}, { message: "Due date must be a valid date string." })
  dueDate!: string;
}

export class UpdateTaskDto {
  @IsOptional()
  title?: string;

  @IsOptional()
  description?: string;

  @IsOptional()
  status?: "pending" | "in-progress" | "completed";

  @IsOptional()
  priority?: "low" | "medium" | "high";

  @IsOptional()
  assignedTo?: string[] | string;

  @IsOptional()
  dueDate?: string;

  @IsOptional()
  @IsArray({ message: "Attachments must be an array of strings." })
  @IsString({ each: true })
  existingFiles?: string[];
}