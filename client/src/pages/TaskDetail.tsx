import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, User, Clock, Edit, Trash2, CheckCircle2 } from 'lucide-react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
// import { useApp } from '../context/AppContext';
import type { Task } from '../types/index';

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

export const TaskDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  // const {  deleteTask, updateTask } = useApp();
  // const [tasks, setTasks] = useState<Task[]>(mockTasks);

  const task = mockTasks.find(t => t.id === id);

  if (!task) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Task not found</p>
          <Button onClick={() => navigate('/tasks')} className="mt-4">
            Back to Tasks
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      // deleteTask(task.id);
      navigate('/tasks');
    }
  };

  const handleMarkComplete = () => {
    // updateTask(task.id, { status: 'completed' });
    // setTasks(tasks.map(t => t.id === task.id ? { ...t, status: 'completed' } : t));
  };

  const statusColors = {
    'todo': 'bg-gray-100 text-gray-700',
    'in-progress': 'bg-blue-100 text-blue-700',
    'completed': 'bg-green-100 text-green-700',
  };

  const priorityColors = {
    'high': 'bg-red-100 text-red-700',
    'medium': 'bg-yellow-100 text-yellow-700',
    'low': 'bg-green-100 text-green-700',
  };

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto space-y-6"
      >
        <div className="flex items-center gap-4">
          <Link to="/tasks">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 flex-1">Task Details</h1>
          <Button variant="outline" onClick={() => navigate(`/tasks/${task.id}/edit`)}>
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>

        <Card className="p-8">
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{task.title}</h2>
                <div className="flex items-center gap-3">
                  <span className={`text-sm font-medium px-3 py-1 rounded-full ${statusColors[task.status]}`}>
                    {task.status.replace('-', ' ')}
                  </span>
                  <span className={`text-sm font-medium px-3 py-1 rounded-full ${priorityColors[task.priority]}`}>
                    {task.priority} priority
                  </span>
                </div>
              </div>
              {task.status !== 'completed' && (
                <Button onClick={handleMarkComplete}>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Mark Complete
                </Button>
              )}
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
              <p className="text-gray-700 leading-relaxed">{task.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-gray-200">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Due Date</p>
                  <p className="text-base font-semibold text-gray-900 mt-1">{task.dueDate}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <User className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Assignee</p>
                  <p className="text-base font-semibold text-gray-900 mt-1">{task.assignee}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Clock className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Last Updated</p>
                  <p className="text-base font-semibold text-gray-900 mt-1">{task.updatedAt}</p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>Created on {task.createdAt}</span>
                <span>Task ID: {task.id}</span>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </DashboardLayout>
  );
};
