export type TaskStatus = 'todo' | 'in-progress' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
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

export interface TaskFormData {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  assignee: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  assignee: string;
  createdAt: string;
  updatedAt: string;
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
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
