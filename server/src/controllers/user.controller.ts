import { Types } from "mongoose";
import { UserService } from "../services/user.service";
import { Request, Response } from "express";
import { HTTP_STATUS, HTTP_MESSAGE } from "../constants/http";
import { HttpError } from "../utils/HttpError";

export class UserController {
    constructor(private _userService: UserService) { };

    async getUser(req: Request, res: Response) {
        try {
            const userId = new Types.ObjectId(req.user?.userId);

            if (!userId) {
                return res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, message: HTTP_MESSAGE.TASK_ID_REQUIRED });
            }
            const task = await this._userService.getUser(userId);
            console.log("recieved userId : ", userId);
            res.status(HTTP_STATUS.OK).json({ success: true, message: HTTP_MESSAGE.OK, data: task });
        } catch (error: unknown) {
            if (error instanceof HttpError) {
                console.info(`HTTP Error: ${error.status} - ${error.message}`);
                res.status(error.status).json({ success: false, message: error.message });
            } else {
                console.error('Unexpected error:', error);
                res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success: false, message: HTTP_MESSAGE.INTERNAL_SERVER_ERROR })
            }
        }
    }

}