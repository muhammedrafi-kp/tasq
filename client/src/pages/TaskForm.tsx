import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Save } from 'lucide-react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';
import { useApp } from '../context/AppContext';
import type { TaskStatus, TaskPriority } from '../types/index';

export const TaskForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { tasks, addTask, updateTask, user } = useApp();

  const isEditing = id !== 'new';
  const existingTask = isEditing ? tasks.find(t => t.id === id) : null;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'todo' as TaskStatus,
    priority: 'medium' as TaskPriority,
    dueDate: '',
    assignee: user?.name || '',
  });

  useEffect(() => {
    if (existingTask) {
      setFormData({
        title: existingTask.title,
        description: existingTask.description,
        status: existingTask.status,
        priority: existingTask.priority,
        dueDate: existingTask.dueDate,
        assignee: existingTask.assignee,
      });
    }
  }, [existingTask]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isEditing && existingTask) {
      updateTask(existingTask.id, formData);
    } else {
      addTask(formData);
    }

    navigate('/tasks');
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto space-y-6"
      >
        <div className="flex items-center gap-4">
          <Link to="/tasks">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditing ? 'Edit Task' : 'Create New Task'}
          </h1>
        </div>

        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              name="title"
              label="Task Title"
              placeholder="Enter task title"
              value={formData.title}
              onChange={handleChange}
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                placeholder="Enter task description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                name="status"
                label="Status"
                value={formData.status}
                onChange={handleChange}
                options={[
                  { value: 'todo', label: 'To Do' },
                  { value: 'in-progress', label: 'In Progress' },
                  { value: 'completed', label: 'Completed' },
                ]}
              />

              <Select
                name="priority"
                label="Priority"
                value={formData.priority}
                onChange={handleChange}
                options={[
                  { value: 'low', label: 'Low' },
                  { value: 'medium', label: 'Medium' },
                  { value: 'high', label: 'High' },
                ]}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                name="dueDate"
                type="date"
                label="Due Date"
                value={formData.dueDate}
                onChange={handleChange}
                required
              />

              <Input
                name="assignee"
                label="Assignee"
                placeholder="Enter assignee name"
                value={formData.assignee}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1">
                <Save className="w-4 h-4 mr-2" />
                {isEditing ? 'Update Task' : 'Create Task'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/tasks')}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </motion.div>
    </DashboardLayout>
  );
};
