import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Filter } from 'lucide-react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { TaskCard } from '../components/TaskCard';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
// import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import type { TaskStatus, TaskPriority,Task } from '../types/index';

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

export const TaskList: React.FC = () => {
  // const { tasks } = useApp();
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'all'>('all');

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
            <p className="text-gray-600 mt-2">Manage and track all your tasks</p>
          </div>
          <Button onClick={() => navigate('/tasks/new')}>
            <Plus className="w-5 h-5 mr-2" />
            New Task
          </Button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as TaskStatus | 'all')}
              options={[
                { value: 'all', label: 'All Status' },
                { value: 'todo', label: 'To Do' },
                { value: 'in-progress', label: 'In Progress' },
                { value: 'completed', label: 'Completed' },
              ]}
            />

            <Select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as TaskPriority | 'all')}
              options={[
                { value: 'all', label: 'All Priority' },
                { value: 'low', label: 'Low' },
                { value: 'medium', label: 'Medium' },
                { value: 'high', label: 'High' },
              ]}
            />
          </div>

          <div className="flex items-center gap-2 mt-4 text-sm text-gray-600">
            <Filter className="w-4 h-4" />
            <span>Showing {filteredTasks.length} of {tasks.length} tasks</span>
          </div>
        </motion.div>

        {filteredTasks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-gray-500 text-lg">No tasks found matching your filters</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTasks.map((task, index) => (
              <TaskCard key={task.id} task={task} index={index} />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
