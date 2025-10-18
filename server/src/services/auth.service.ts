import { Response } from "express";
import { User } from "../models/user.model";
import { HTTP_STATUS, HTTP_MESSAGE } from "../constants/http";
import { HttpError } from "../utils/HttpError";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwt";
import { verifyGoogleToken } from "../utils/googleAuth";
import { AuthDTo } from "../dtos/response/auth.dto";
import { clearCookie } from "../utils/cookie";

export class AuthService {
    async login(email: string, password: string): Promise<{ accessToken: string, user: AuthDTo }> {
        try {
            const user = await User.findOne({ email });

            if (!user) throw new HttpError(HTTP_MESSAGE.USER_NOT_FOUND, HTTP_STATUS.NOT_FOUND);

            if (user.authProvider === "google") throw new HttpError(HTTP_MESSAGE.GOOGLE_SIGNIN_REQUIRED, HTTP_STATUS.CONFLICT);

            const isPasswordMatch = await bcrypt.compare(password, user.password!);

            if (!isPasswordMatch) throw new HttpError(HTTP_MESSAGE.INCORRECT_PASSWORD, HTTP_STATUS.UNAUTHORIZED);

            console.log(process.env.JWT_ACCESS_SECRET)

            const accessToken = generateToken({ userId: user._id }, process.env.JWT_ACCESS_SECRET as string, 3600);

            return { accessToken, user: AuthDTo.from(user) };

        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            console.log("Error while login user :", message);
            throw error;
        }
    }



    async signup(name: string, email: string, password: string): Promise<{ accessToken: string, user: AuthDTo }> {
        try {
            const existingUser = await User.findOne({ email });

            if (existingUser) throw new HttpError(HTTP_MESSAGE.ALREADY_EXISTS, HTTP_STATUS.CONFLICT);

            const hashedPassword = await bcrypt.hash(password, 10);

            const userData = {
                name,
                email,
                password: hashedPassword
            }

            const user = new User(userData);
            await user.save();

            const accessToken = generateToken({ userId: user._id }, process.env.JWT_ACCESS_SECRET as string, 3600);

            return { accessToken, user: AuthDTo.from(user) };

        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            console.log("Error while signup user :", message);
            throw error;
        }
    }

    async handleGoogleAuth(credential: string): Promise<{ accessToken: string; user: AuthDTo }> {
        try {

            const payload = await verifyGoogleToken(credential);

            if (!payload || !payload.email || !payload.name) {
                throw new HttpError("Invalid Google payload", HTTP_STATUS.BAD_REQUEST);
            }

            const { email, name } = payload;

            let user = await User.findOne({ email });

            if (!user) {
                user = new User({
                    name,
                    email,
                    authProvider: "google"
                });
                await user.save();
            }

            const accessToken = generateToken({ userId: user._id }, process.env.JWT_ACCESS_SECRET as string, 3600);

            return { accessToken, user: AuthDTo.from(user) };

        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            console.log("Error while signup user :", message);
            throw error;
        }
    }

    async logout(res: Response): Promise<void> {
        try {
            clearCookie(res, "accessToken");
            return;
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            console.log("Error while logouting user :", message);
            throw error;
        }
    }

}