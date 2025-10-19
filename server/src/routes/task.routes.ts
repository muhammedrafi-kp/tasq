import { Router } from "express";
import { TaskController } from "../controllers/task.controller";
import { TaskService } from "../services/task.service";

import { validateToken } from "../middlewares/auth.middleware";
import { validateRequest } from "../middlewares/validate.middleware";
import { CreateTaskDto } from "../dtos/request/task.dto";

const taskService = new TaskService();
const taskController = new TaskController(taskService);

const router = Router();

router.post("/", validateRequest(CreateTaskDto), taskController.createTask.bind(taskController));
router.get("/", validateToken, taskController.getTasks.bind(taskController));
router.get("/:taskId", taskController.getTask.bind(taskController));

export default router;