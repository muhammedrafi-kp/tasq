import { Request, Response } from "express";
import { HTTP_STATUS, HTTP_MESSAGE } from "../constants/http";
import { HttpError } from "../utils/HttpError";
import { AuthService } from "../services/auth.service";
import { setCookie } from "../utils/cookie"

export class AuthController {

    constructor(private _authService: AuthService) { }

    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            console.log(email, password)
            const { accessToken, user } = await this._authService.login(email, password);

            // console.log("accessToken :", accessToken)
            console.log("user :", user);

            setCookie(res, 'accessToken', accessToken, 3600 * 1000);

            res.status(HTTP_STATUS.OK).json({ success: true, message: HTTP_MESSAGE.LOGIN_SUCCESS, data: user });

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

    async signup(req: Request, res: Response) {
        try {
            const { name, email, password } = req.body;
            console.log(req.body);

            const { accessToken, user } = await this._authService.signup(name, email, password);

            console.log("accessToken :", accessToken)
            console.log("user :", user)

            setCookie(res, 'accessToken', accessToken, 3600 * 1000);

            res.status(HTTP_STATUS.OK).json({ success: true, message: HTTP_MESSAGE.CREATED, data: user });

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

    async googleAuthCallback(req: Request, res: Response): Promise<void> {
        try {
            const { credential } = req.body;
            console.log("credential : ", typeof credential);

            const { accessToken, user } = await this._authService.handleGoogleAuth(credential);

            setCookie(res, "accessToken", accessToken, 3600 * 1000);

            res.status(HTTP_STATUS.OK).json({ success: true, message: HTTP_MESSAGE.CREATED, data: user });

        } catch (error: any) {
            if (error instanceof HttpError) {
                console.info(`HTTP Error: ${error.status} - ${error.message}`);
                res.status(error.status).json({ success: false, message: error.message });
            } else {
                console.error('Unexpected error:', error);
                res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success: false, message: HTTP_MESSAGE.INTERNAL_SERVER_ERROR })
            }
        }
    }

    async logout(req: Request, res: Response) {
        try {
            await this._authService.logout(res);

            res.status(HTTP_STATUS.OK).json({ success: true, message: HTTP_MESSAGE.OK });

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