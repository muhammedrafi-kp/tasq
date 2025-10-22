export type TaskStatus = 'pending' | 'in-progress' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  pagination?: {
    totalCount: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
}

export interface SignupFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

// export interface TaskFormData {
//   files: File[];
//   title: string;
//   description: string;
//   status: TaskStatus;
//   priority: TaskPriority;
//   dueDate: string;
//   assignedTo: string;
// }

export interface IAttachment {
  filename: string;
  url: string;
}

export interface IComment {
  userId?: string;
  email: string;
  text: string;
  createdAt: string;
}

export interface IAssignee {
  userId?: string;
  email: string;
}

export interface ITask {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  assignedTo?: IAssignee[];
  attachments?: IAttachment[];
  comments?: IComment[];
  createdAt: string;
  updatedAt: string;
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  // role: string;
}

export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  inProgress: number;
}

export interface AnalyticsData {
  date: string;
  completed: number;
  created: number;
}

export interface ValidationErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export interface FormData {
  name?: string;
  email: string;
  password: string;
  confirmPassword?: string;
}