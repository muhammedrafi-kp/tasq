export type TaskStatus = 'todo' | 'in-progress' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high';

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

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
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
