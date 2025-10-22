import { Types } from "mongoose";
import { User } from "../models/user.model";
import { UserDto } from "../dtos/response/user.dto";
import { HttpError } from "../utils/HttpError";
import { HTTP_STATUS, HTTP_MESSAGE } from "../constants/http";
import { UpdateUserDto } from "../dtos/request/user.dto";


export class UserService {
    constructor() { };

    async getUser(userId: Types.ObjectId): Promise<UserDto> {
        try {
            const user = await User.findById(userId);
            console.log("hello world")
            if (!user) throw new HttpError(HTTP_MESSAGE.NOT_FOUND, HTTP_STATUS.NOT_FOUND);

            return UserDto.from(user);

        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            console.log("Error while login user :", message);
            throw error;
        }
    }

    async updateUser(userId: Types.ObjectId, userData: UpdateUserDto): Promise<UserDto> {
        try {
            const user = await User.findByIdAndUpdate(userId, userData, { new: true });
            if (!user) throw new HttpError(HTTP_MESSAGE.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
            return UserDto.from(user);
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            console.log("Error while updating user :", message);
            throw error;
        }
    }   
}