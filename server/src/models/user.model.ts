import { Schema, Document, model,Types } from "mongoose";

export interface IUser extends Document {
    _id: Types.ObjectId,
    name: string;
    email: string;
    password?: string;
    authProvider: "local" | "google";
    createdAt: Date;
}

const userSchema = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: {
        type: String,
        required: function () {
            return this.authProvider === 'local';
        }
    },
    authProvider: { type: String, enum: ["google", "local"], default: "local" }
}, { timestamps: true });

export const User = model<IUser>('User', userSchema);