import { Router } from "express";
import {UserController} from "../controllers/user.controller";
import {UserService} from "../services/user.service";
import { validateToken } from "../middlewares/auth.middleware";
import { validateRequest } from "../middlewares/validate.middleware";
import { UpdateUserDto } from "../dtos/request/user.dto";

const userService = new UserService();
const userController = new UserController(userService);

const router = Router();

router.get('/me',validateToken,userController.getUser.bind(userController));
router.patch('/me',validateToken,validateRequest(UpdateUserDto),userController.updateUser.bind(userController));

export default router;