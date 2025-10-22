import React from 'react';
import { Calendar, User, Paperclip, MessageCircle, Clock } from 'lucide-react';
import type { ITask } from "../types/index";
import { Link } from 'react-router-dom';

interface TaskCardProps {
  task: ITask;
  index: number;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const statusColors = {
    'pending': 'bg-gray-100 text-gray-700',
    'in-progress': 'bg-blue-100 text-blue-700',
    'completed': 'bg-green-100 text-green-700',
  };

  const priorityColors = {
    'high': 'bg-red-100 text-red-700',
    'medium': 'bg-yellow-100 text-yellow-700',
    'low': 'bg-green-100 text-green-700',
  };

  // Format date to readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div>
      <Link to={`/tasks/${task.id}`} className="task-card-link">
        <div className="task-card">
          <div className="task-card-header">
            <h3 className="task-card-title">{task?.title}</h3>
            <div className="flex items-center gap-2">
              <span className={`task-card-priority ${priorityColors[task.priority]}`}>
                {task.priority}
              </span>
              <span className={`task-card-status ${statusColors[task.status]}`}>
                {task?.status.replace('-', ' ')}
              </span>
            </div>
          </div>

          <p className="task-card-description">{task?.description}</p>

          <div className="task-card-footer">
            {/* Top row - Created date and Due date */}
            <div className="flex items-center gap-3 text-sm text-gray-600 mb-2">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>Created: {formatDate(task.createdAt)}</span>
              </div>
              {task?.dueDate && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Due: {formatDate(task.dueDate)}</span>
                </div>
              )}
            </div>

            {/* Bottom row - Counts and metrics */}
            <div className="flex items-center gap-3 text-sm text-gray-600">
              {task.assignedTo && task.assignedTo.length > 0 && (
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span>{task.assignedTo.length}</span>
                </div>
              )}

              {task.attachments && task.attachments.length > 0 && (
                <div className="flex items-center gap-1">
                  <Paperclip className="w-4 h-4" />
                  <span>{task.attachments.length}</span>
                </div>
              )}

              {task.comments && task.comments.length > 0 && (
                <div className="flex items-center gap-1">
                  <MessageCircle className="w-4 h-4" />
                  <span>{task.comments.length}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};
