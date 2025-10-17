import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, User } from 'lucide-react';
import { Card } from './ui/Card';
import type {Task} from "../types/index";
import { Link } from 'react-router-dom';

interface TaskCardProps {
  task: Task;
  index: number;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, index }) => {
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link to={`/tasks/${task.id}`}>
        <Card hover className="p-5 cursor-pointer">
          <div className="flex items-start justify-between mb-3">
            <h3 className="font-semibold text-gray-900 text-lg flex-1">{task.title}</h3>
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${priorityColors[task.priority]}`}>
              {task.priority}
            </span>
          </div>

          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{task.description}</p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <span>{task.dueDate}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <User className="w-4 h-4" />
                <span>{task.assignee}</span>
              </div>
            </div>

            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[task.status]}`}>
              {task.status.replace('-', ' ')}
            </span>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
};
