import mongoose, { Schema, Document, model, Types } from "mongoose";

export interface IComment {
  userId?: Types.ObjectId;
  email: string;
  text: string;
  createdAt: Date;
}

export interface IAssignee {
  userId?: Types.ObjectId;
  email: string;
}

export interface IAttachment {
  filename: string;
  url: string;
}

export interface ITask extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  title: string;
  description?: string;
  status: "pending" | "in-progress" | "completed";
  priority: "low" | "medium" | "high";
  dueDate: Date;
  assignedTo?: IAssignee[];
  attachments?: IAttachment[];
  comments?: IComment[];
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
    assignedTo: [{
      userId: { type: Schema.Types.ObjectId, ref: 'User' },
      email: { type: String, required: true },
    }],
    attachments: [{
      filename: { type: String, required: true },
      url: { type: String, required: true },
    }],
    comments: [{
      userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      email: { type: String, required: true },
      text: { type: String, required: true },
      createdAt: { type: Date, default: Date.now },
    }],
    isDeleted: { type: Boolean, default: false }
  }, { timestamps: true });

export const Task = model<ITask>("Task", taskSchema);