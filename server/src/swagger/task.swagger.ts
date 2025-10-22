/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: Task management endpoints
 *
 * components:
 *   schemas:
 *     TaskDto:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: 64f9b8c7e2a5a1f9b0c1a3f4
 *         userId:
 *           type: string
 *           example: 64f9a7c9d2e1a6a1f9b0c1a2
 *         title:
 *           type: string
 *           example: Finish project documentation
 *         description:
 *           type: string
 *           example: Complete the task API docs
 *         status:
 *           type: string
 *           enum: [pending, in-progress, completed]
 *           example: pending
 *         priority:
 *           type: string
 *           enum: [low, medium, high]
 *           example: medium
 *         dueDate:
 *           type: string
 *           format: date
 *           example: 2025-10-30
 *         assignedTo:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 example: 64f9a7c9d2e1a6a1f9b0c1a2
 *               email:
 *                 type: string
 *                 example: john@example.com
 *         attachments:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               filename:
 *                 type: string
 *                 example: file.pdf
 *               url:
 *                 type: string
 *                 example: https://res.cloudinary.com/.../file.pdf
 *         comments:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 example: 64f9a7c9d2e1a6a1f9b0c1a2
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               text:
 *                 type: string
 *                 example: Great work!
 *               createdAt:
 *                 type: string
 *                 format: date-time
 *         isDeleted:
 *           type: boolean
 *           example: false
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     CreateTaskDto:
 *       type: object
 *       required:
 *         - title
 *         - dueDate
 *       properties:
 *         title:
 *           type: string
 *           example: Finish project documentation
 *         description:
 *           type: string
 *           example: Complete the task API docs
 *         status:
 *           type: string
 *           enum: [pending, in-progress, completed]
 *           example: pending
 *         priority:
 *           type: string
 *           enum: [low, medium, high]
 *           example: medium
 *         assignedTo:
 *           type: array
 *           items:
 *             type: string
 *           example: ["john@example.com"]
 *         dueDate:
 *           type: string
 *           format: date
 *           example: 2025-10-30
 *
 *     UpdateTaskDto:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           example: Updated task title
 *         description:
 *           type: string
 *           example: Updated description
 *         status:
 *           type: string
 *           enum: [pending, in-progress, completed]
 *           example: completed
 *         priority:
 *           type: string
 *           enum: [low, medium, high]
 *           example: high
 *         assignedTo:
 *           type: array
 *           items:
 *             type: string
 *           example: ["jane@example.com"]
 *         dueDate:
 *           type: string
 *           format: date
 *           example: 2025-11-01
 *         existingFiles:
 *           type: array
 *           items:
 *             type: string
 *
 *     TasksResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         tasks:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/TaskDto'
 *         totalCount:
 *           type: number
 *           example: 10
 *         totalPages:
 *           type: number
 *           example: 2
 *         currentPage:
 *           type: number
 *           example: 1
 *
 *     TaskResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         task:
 *           $ref: '#/components/schemas/TaskDto'
 *
 *     DashboardStats:
 *       type: object
 *       properties:
 *         total:
 *           type: number
 *           example: 12
 *         pending:
 *           type: number
 *           example: 5
 *         inProgress:
 *           type: number
 *           example: 4
 *         completed:
 *           type: number
 *           example: 3
 *
 *     AnalyticsData:
 *       type: object
 *       properties:
 *         statusData:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               value:
 *                 type: number
 *         priorityData:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               value:
 *                 type: number
 *         weeklyData:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               day:
 *                 type: string
 *               completed:
 *                 type: number
 *               created:
 *                 type: number
 *         completionRate:
 *           type: number
 *         tasksThisWeek:
 *           type: number
 *         avgCompletionTime:
 *           type: number
 */

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Create a new task with optional file attachments
 *     tags: [Tasks]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *               priority:
 *                 type: string
 *               assignedTo:
 *                 type: array
 *                 items:
 *                   type: string
 *               dueDate:
 *                 type: string
 *     responses:
 *       201:
 *         description: Task created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TaskResponse'
 *       400:
 *         description: Validation error
 *
 *   get:
 *     summary: Get all tasks with optional filtering, searching, sorting, and pagination
 *     tags: [Tasks]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *     responses:
 *       200:
 *         description: List of tasks
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TasksResponse'
 *
 * /tasks/{taskId}:
 *   get:
 *     summary: Get a single task by ID
 *     tags: [Tasks]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TaskResponse'
 *
 *   put:
 *     summary: Update a task by ID (with optional new files)
 *     tags: [Tasks]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               newFiles:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *               priority:
 *                 type: string
 *               assignedTo:
 *                 type: array
 *                 items:
 *                   type: string
 *               dueDate:
 *                 type: string
 *               existingFiles:
 *                 type: array
 *                 items:
 *                   type: string
 *
 *   patch:
 *     summary: Mark a task as complete
 *     tags: [Tasks]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task marked as completed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TaskResponse'
 *
 *   delete:
 *     summary: Soft delete a task
 *     tags: [Tasks]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TaskResponse'
 *
 * /tasks/dashboard/stats:
 *   get:
 *     summary: Get dashboard statistics for tasks
 *     tags: [Tasks]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DashboardStats'
 *
 * /tasks/analytics/data:
 *   get:
 *     summary: Get analytics data for tasks
 *     tags: [Tasks]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Analytics data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AnalyticsData'
 */
