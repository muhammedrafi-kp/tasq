import { Schema, Document, model, Types } from "mongoose";
import { ObjectId } from "mongodb";

export interface ITask extends Document {
  _id: ObjectId;
  userId: Types.ObjectId;
  title: string;
  description?: string;
  status: "pending" | "in-progress" | "completed";
  priority: "low" | "medium" | "high";
  dueDate?: Date;
  tags?: string[];
  assignedTo?: string;
  // createdBy: string;
  isDeleted?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema<ITask>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    status: { type: String, enum: ["pending", "in-progress", "completed"], default: "pending" },
    priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
    dueDate: { type: Date },
    tags: { type: [String], default: [] },
    assignedTo: { type: String, trim: true },
    // created_by: { type: Schema.Types.ObjectId, ref: "User", required: true },
    isDeleted: { type: Boolean, default: false }
  }, { timestamps: true });

export const Task = model<ITask>("Task", taskSchema);