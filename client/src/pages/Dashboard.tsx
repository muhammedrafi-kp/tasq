import React, { useState } from 'react';
import { ListTodo, CheckCircle2, Clock, TrendingUp } from 'lucide-react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { StatCard } from '../components/StateCard';
import { Card } from '../components/ui/Card';
// import { useApp } from '../context/AppContext';
import { Link } from 'react-router-dom';
import type{ITask} from "../types/index";

const mockTasks: ITask[] = [
  {
    id: '1',
    title: 'Design new landing page',
    description: 'Create wireframes and mockups for the new landing page redesign',
    status: 'in-progress',
    priority: 'high',
    dueDate: '2025-10-20',
    assignedTo: 'John Doe',
    createdAt: '2025-10-15',
    updatedAt: '2025-10-17',
  },
  {
    id: '2',
    title: 'Fix login bug',
    description: 'Users are experiencing issues logging in with social accounts',
    status: 'pending',
    priority: 'high',
    dueDate: '2025-10-18',
    assignedTo: 'Jane Smith',
    createdAt: '2025-10-14',
    updatedAt: '2025-10-16',
  },
  {
    id: '3',
    title: 'Update documentation',
    description: 'Add API documentation for the new endpoints',
    status: 'completed',
    priority: 'medium',
    dueDate: '2025-10-15',
    assignedTo: 'John Doe',
    createdAt: '2025-10-10',
    updatedAt: '2025-10-15',
  },
  {
    id: '4',
    title: 'Implement dark mode',
    description: 'Add dark mode toggle and theme switching functionality',
    status: 'in-progress',
    priority: 'medium',
    dueDate: '2025-10-22',
    assignedTo: 'Mike Johnson',
    createdAt: '2025-10-12',
    updatedAt: '2025-10-17',
  },
  {
    id: '5',
    title: 'Set up CI/CD pipeline',
    description: 'Configure automated testing and deployment workflow',
    status: 'pending',
    priority: 'low',
    dueDate: '2025-10-25',
    assignedTo: 'Jane Smith',
    createdAt: '2025-10-13',
    updatedAt: '2025-10-14',
  },
];

export const Dashboard: React.FC = () => {
  // const { tasks } = useApp();
  const [tasks] = useState<ITask[]>(mockTasks)

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    pending: tasks.filter(t => t.status === 'pending').length,
  };

  const completionRate = stats.total > 0
    ? Math.round((stats.completed / stats.total) * 100)
    : 0;

  const recentTasks = tasks.slice(0, 5);

  return (
    <DashboardLayout>
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Dashboard</h1>
          <p className="dashboard-subtitle">Welcome back! Here's your task overview.</p>
        </div>

        <div className="stats-grid">
          <StatCard
            title="Total Tasks"
            value={stats.total}
            icon={ListTodo}
            color="bg-blue-500"
            delay={0.1}
          />
          <StatCard
            title="Completed"
            value={stats.completed}
            icon={CheckCircle2}
            color="bg-green-500"
            trend={`${completionRate}% completion rate`}
            delay={0.2}
          />
          <StatCard
            title="In Progress"
            value={stats.inProgress}
            icon={Clock}
            color="bg-orange-500"
            delay={0.3}
          />
          <StatCard
            title="Pending"
            value={stats.pending}
            icon={TrendingUp}
            color="bg-purple-500"
            delay={0.4}
          />
        </div>

        <div className="dashboard-grid">
          <div>
            <Card className="progress-card">
              <h2 className="progress-title">Task Completion Progress</h2>
              <div className="progress-item">
                <div className="progress-label">
                  <span className="progress-label-text">Overall Progress</span>
                  <span className="progress-label-value">{completionRate}%</span>
                </div>
                <div className="progress-bar-container">
                  <div
                    className="progress-bar progress-bar-blue"
                    style={{ width: `${completionRate}%` }}
                  />
                </div>
              </div>

              <div className="progress-item">
                <div className="progress-label">
                  <span className="progress-label-text">Completed Tasks</span>
                  <span className="progress-label-value">{stats.completed} / {stats.total}</span>
                </div>
                <div className="progress-bar-container">
                  <div
                    className="progress-bar progress-bar-green"
                    style={{ width: `${(stats.completed / stats.total) * 100}%` }}
                  />
                </div>
              </div>

              <div className="progress-item">
                <div className="progress-label">
                  <span className="progress-label-text">In Progress</span>
                  <span className="progress-label-value">{stats.inProgress} / {stats.total}</span>
                </div>
                <div className="progress-bar-container">
                  <div
                    className="progress-bar progress-bar-orange"
                    style={{ width: `${(stats.inProgress / stats.total) * 100}%` }}
                  />
                </div>
              </div>
            </Card>
          </div>

          <div>
            <Card className="progress-card">
              <div className="recent-tasks-header">
                <h2 className="recent-tasks-title">Recent Tasks</h2>
                <Link to="/tasks" className="recent-tasks-link">
                  View All
                </Link>
              </div>
              <div className="recent-tasks-list">
                {recentTasks.map((task) => (
                  <Link key={task.id} to={`/tasks/${task.id}`} className="task-item">
                    <div className="task-item-content">
                      <div className="task-item-info">
                        <h3 className="task-item-title">{task.title}</h3>
                        <p className="task-item-assignee">{task.assignedTo}</p>
                      </div>
                      <span className={`task-priority priority-${task.priority}`}>
                        {task.priority}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
