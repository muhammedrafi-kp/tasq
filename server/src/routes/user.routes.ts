import { Router } from "express";
import {UserController} from "../controllers/user.controller";
import {UserService} from "../services/user.service";
import { validateToken } from "../middlewares/auth.middleware";

const userService = new UserService();
const userController = new UserController(userService);

const router = Router();

router.get('/me',validateToken,userController.getUser.bind(userController));

export default router;