import { Router } from "express";
import { TaskController } from "../controllers/task.controller";
import { TaskService } from "../services/task.service";
import upload from "../middlewares/multer.middleware";
import { validateToken } from "../middlewares/auth.middleware";
import { validateRequest } from "../middlewares/validate.middleware";
import { CreateTaskDto,UpdateTaskDto } from "../dtos/request/task.dto";

const taskService = new TaskService();
const taskController = new TaskController(taskService);

const router = Router();

router.post("/", validateToken, upload.array("files", 5), validateRequest(CreateTaskDto), taskController.createTask.bind(taskController));
router.get("/", validateToken, taskController.getTasks.bind(taskController));
router.get("/:taskId", taskController.getTask.bind(taskController));
router.patch("/:taskId/complete", validateToken, taskController.markTaskAsComplete.bind(taskController));
router.put("/:taskId", validateToken, upload.array("newFiles", 5), validateRequest(UpdateTaskDto), taskController.updateTask.bind(taskController));
router.delete("/:taskId", validateToken, taskController.deleteTask.bind(taskController));
router.delete("/:taskId/permanent", validateToken, taskController.deleteTaskPermanently.bind(taskController));
router.get("/dashboard/stats", validateToken, taskController.getDashboardTasksStats.bind(taskController));
router.get("/analytics/data", validateToken, taskController.getAnalyticsData.bind(taskController));

export default router;