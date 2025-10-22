import React, { useState,useEffect } from 'react';
import { ListTodo, CheckCircle2, Clock, TrendingUp, Loader2 } from 'lucide-react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { StatCard } from '../components/StateCard';
import { Card } from '../components/ui/Card';
// import { useApp } from '../context/AppContext';
import { Link } from 'react-router-dom';
import type{ApiResponse, ITask} from "../types/index";
import { getDashboardTasksStats,getTasks } from '../services/taskService';
import { Button } from '../components/ui/Button';



export const Dashboard: React.FC = () => {
  // const { tasks } = useApp();
  const [recentTasks, setRecentTasks] = useState<ITask[]>([])
  const [stats, setStats] = useState<{ total: number, pending: number, inProgress: number, completed: number }>({ total: 0, pending: 0, inProgress: 0, completed: 0 })
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const [statsRes, tasksRes]: [ApiResponse<{ total: number, pending: number, inProgress: number, completed: number }>, ApiResponse<ITask[]>] = await Promise.all([
          getDashboardTasksStats(),
          getTasks({ page: 1, limit: 5, sortBy: 'createdAt', sortOrder: 'desc' })
        ]);

        if (statsRes.success && statsRes.data) setStats(statsRes.data);
        else setError('Failed to fetch dashboard stats');

        if (tasksRes.success && tasksRes.data) setRecentTasks(tasksRes.data);
        else setError(prev => prev ?? 'Failed to fetch recent tasks');
      } catch (e) {
        setError('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const calculateCompletionRate = (total: number, completed: number) => {
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  }

  const DashboardLoadingSpinner = () => (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600 mb-4" />
        <p className="text-gray-600">Loading your dashboard...</p>
      </div>
    </div>
  );

  const DashboardErrorState = () => (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ListTodo className="w-8 h-8 text-red-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to load dashboard</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()} variant="outline">
          Try Again
        </Button>
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Dashboard</h1>
          <p className="dashboard-subtitle">Welcome back! Here's your task overview.</p>
        </div>

        {isLoading ? (
          <DashboardLoadingSpinner />
        ) : error ? (
          <DashboardErrorState />
        ) : (
        <>
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
            // trend={`${calculateCompletionRate(stats.total, stats.completed)}% completion rate`}
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
                  <span className="progress-label-value">{calculateCompletionRate(stats.total, stats.completed)}%</span>
                </div>
                <div className="progress-bar-container">
                  <div
                    className="progress-bar progress-bar-blue"
                    style={{ width: `${calculateCompletionRate(stats.total, stats.completed)}%` }}
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
                        {/* <p className="task-item-assignee">{task.assignees?.map((assignee: IAssignee) => assignee.name).join(', ')}</p> */}
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
        </>
        )}
      </div>
    </DashboardLayout>
  );
}
