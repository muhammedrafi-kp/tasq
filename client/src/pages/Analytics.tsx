import React,{useState} from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Activity, Target } from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card } from '../components/ui/Card';
// import { useApp } from '../context/AppContext';
import type { Task } from "../types/index";

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

export const Analytics: React.FC = () => {
  // const { tasks } = useApp();
  const [tasks, setTasks] = useState<Task[]>(mockTasks)

  const statusData = [
    { name: 'To Do', value: tasks.filter(t => t.status === 'todo').length },
    { name: 'In Progress', value: tasks.filter(t => t.status === 'in-progress').length },
    { name: 'Completed', value: tasks.filter(t => t.status === 'completed').length },
  ];

  const priorityData = [
    { name: 'Low', value: tasks.filter(t => t.priority === 'low').length },
    { name: 'Medium', value: tasks.filter(t => t.priority === 'medium').length },
    { name: 'High', value: tasks.filter(t => t.priority === 'high').length },
  ];

  const weeklyData = [
    { day: 'Mon', completed: 3, created: 5 },
    { day: 'Tue', completed: 5, created: 3 },
    { day: 'Wed', completed: 2, created: 4 },
    { day: 'Thu', completed: 4, created: 2 },
    { day: 'Fri', completed: 6, created: 6 },
    { day: 'Sat', completed: 1, created: 2 },
    { day: 'Sun', completed: 2, created: 1 },
  ];

  const COLORS = ['#6B7280', '#3B82F6', '#10B981'];

  const completionRate = tasks.length > 0
    ? Math.round((tasks.filter(t => t.status === 'completed').length / tasks.length) * 100)
    : 0;

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-2">Track your productivity and task metrics</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <TrendingUp className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                  <p className="text-3xl font-bold text-gray-900">{completionRate}%</p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-xl">
                  <Target className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Tasks This Week</p>
                  <p className="text-3xl font-bold text-gray-900">23</p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-xl">
                  <Activity className="w-8 h-8 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg. Completion Time</p>
                  <p className="text-3xl font-bold text-gray-900">3.2d</p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Weekly Activity</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="day" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFF',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="completed"
                    stroke="#10B981"
                    strokeWidth={2}
                    name="Completed"
                  />
                  <Line
                    type="monotone"
                    dataKey="created"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    name="Created"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Tasks by Status</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent as number * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Tasks by Priority</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={priorityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="name" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFF',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="value" fill="#3B82F6" radius={[8, 8, 0, 0]} name="Tasks" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
};
