import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ListTodo, CheckCircle2, Clock, TrendingUp } from 'lucide-react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { StatCard } from '../components/StateCard';
import { Card } from '../components/ui/Card';
// import { useApp } from '../context/AppContext';
import { Link } from 'react-router-dom';
import type{Task} from "../types/index";

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Design new landing page',
    description: 'Create wireframes and mockups for the new landing page redesign',
    status: 'in-progress',
    priority: 'high',
    dueDate: '2025-10-20',
    assignee: 'John Doe',
    createdAt: '2025-10-15',
    updatedAt: '2025-10-17',
  },
  {
    id: '2',
    title: 'Fix login bug',
    description: 'Users are experiencing issues logging in with social accounts',
    status: 'todo',
    priority: 'high',
    dueDate: '2025-10-18',
    assignee: 'Jane Smith',
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
    assignee: 'John Doe',
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
    assignee: 'Mike Johnson',
    createdAt: '2025-10-12',
    updatedAt: '2025-10-17',
  },
  {
    id: '5',
    title: 'Set up CI/CD pipeline',
    description: 'Configure automated testing and deployment workflow',
    status: 'todo',
    priority: 'low',
    dueDate: '2025-10-25',
    assignee: 'Jane Smith',
    createdAt: '2025-10-13',
    updatedAt: '2025-10-14',
  },
];

export const Dashboard: React.FC = () => {
  // const { tasks } = useApp();
  const [tasks,setTasks] = useState<Task[]>(mockTasks)

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    pending: tasks.filter(t => t.status === 'todo').length,
  };

  const completionRate = stats.total > 0
    ? Math.round((stats.completed / stats.total) * 100)
    : 0;

  const recentTasks = tasks.slice(0, 5);

  const priorityColors = {
    high: 'bg-red-100 text-red-700',
    medium: 'bg-yellow-100 text-yellow-700',
    low: 'bg-green-100 text-green-700',
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back! Here's your task overview.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Task Completion Progress</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Overall Progress</span>
                    <span className="font-medium text-gray-900">{completionRate}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${completionRate}%` }}
                      transition={{ delay: 0.6, duration: 0.8 }}
                      className="bg-blue-600 h-3 rounded-full"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Completed Tasks</span>
                    <span className="font-medium text-gray-900">{stats.completed} / {stats.total}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      style={{ width: `${(stats.completed / stats.total) * 100}%` }}
                      className="bg-green-500 h-2 rounded-full"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">In Progress</span>
                    <span className="font-medium text-gray-900">{stats.inProgress} / {stats.total}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      style={{ width: `${(stats.inProgress / stats.total) * 100}%` }}
                      className="bg-orange-500 h-2 rounded-full"
                    />
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Recent Tasks</h2>
                <Link to="/tasks" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  View All
                </Link>
              </div>
              <div className="space-y-3">
                {recentTasks.map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                  >
                    <Link to={`/tasks/${task.id}`}>
                      <div className="p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900">{task.title}</h3>
                            <p className="text-sm text-gray-500 mt-1">{task.assignee}</p>
                          </div>
                          <span className={`text-xs font-medium px-2 py-1 rounded ${priorityColors[task.priority]}`}>
                            {task.priority}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
};
