import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Clock, Edit, Trash2, CheckCircle2, Loader2, Download, Eye, MessageCircle, Paperclip, X } from 'lucide-react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
// import { useApp } from '../context/AppContext';
import type { ITask } from '../types/index';
import { getTask } from "../services/taskService";


export const TaskDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [task, setTask] = useState<ITask | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchTask = async () => {
      if (!id) {
        setError('Task ID is required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await getTask(id);
        console.log("task details", response.data);
        if (response.success) {
          setTask(response.data);
        } else {
          setError(response.message || 'Failed to fetch task');
        }
      } catch (err) {
        setError('Failed to fetch task. Please try again.');
        console.error('Error fetching task:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id]);

  // Loading state
  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <p className="text-gray-500 text-lg">Loading task details...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <div className="space-y-4">
            <p className="text-red-500 text-lg">{error}</p>
            <Button onClick={() => navigate('/tasks')} className="mt-4">
              Back to Tasks
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Task not found state
  if (!task) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <div className="space-y-4">
            <p className="text-gray-500 text-lg">Task not found!</p>
            <Button onClick={() => navigate('/tasks')} className="mt-4">
              Back to Tasks
            </Button>
          </div>
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

  const handleDownload = (attachment: any) => {
    const link = document.createElement('a');
    link.href = attachment.url;
    link.download = attachment.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePreview = (attachment: any) => {
    setPreviewImage(attachment.url);
  };

  const closePreview = () => {
    setPreviewImage(null);
  };

  const isImageFile = (filename: string) => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg'];
    return imageExtensions.some(ext => filename.toLowerCase().endsWith(ext));
  };

  const getFileIcon = (filename: string) => {
    if (isImageFile(filename)) return '🖼️';
    if (filename.toLowerCase().endsWith('.pdf')) return '📄';
    if (filename.toLowerCase().endsWith('.doc') || filename.toLowerCase().endsWith('.docx')) return '📝';
    if (filename.toLowerCase().endsWith('.xls') || filename.toLowerCase().endsWith('.xlsx')) return '📊';
    return '📎';
  };

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

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Link to="/tasks">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 flex-1">Task Details</h1>
          <Button variant="outline" onClick={() => navigate(`/tasks/${task.id}/edit`)}>
            <Edit className="w-4 h-4 mr-2" />
            {/* Edit */}
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            <Trash2 className="w-4 h-4 mr-2" />
            {/* Delete */}
          </Button>
        </div>

        <Card className="p-6">
          <div className="form-container">
            <div className="task-header">
              <div className="flex-1">
                <h2 className="task-title">{task.title}</h2>
                <div className="task-badges">
                  <span className={`task-badge ${statusColors[task.status]}`}>
                    {task.status.replace('-', ' ')}
                  </span>
                  <span className={`task-badge ${priorityColors[task.priority]}`}>
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

            <div className="task-section">
              <h3>Description</h3>
              <p className="task-description">{task.description}</p>
            </div>

            <div className="task-info-grid">
              <div className="task-info-item">
                <div className="task-info-icon bg-blue-100">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <div className="task-info-content">
                  <p className="task-info-label">Due Date</p>
                  <p className="task-info-value">{new Date(task.dueDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</p>
                </div>
              </div>

              <div className="task-info-item">
                <div className="task-info-icon bg-green-100">
                  <User className="w-5 h-5 text-green-600" />
                </div>
                <div className="task-info-content">
                  <p className="task-info-label">Assigned To</p>
                  <p className="task-info-value">
                    {task.assignedTo && task.assignedTo.length > 0 
                      ? task.assignedTo.map(assignee => assignee.email).join(', ')
                      : '0'
                    }
                  </p>
                </div>
              </div>

              <div className="task-info-item">
                <div className="task-info-icon bg-purple-100">
                  <Clock className="w-5 h-5 text-purple-600" />
                </div>
                <div className="task-info-content">
                  <p className="task-info-label">Last Updated</p>
                  <p className="task-info-value">{new Date(task.updatedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</p>
                </div>
              </div>
            </div>

            {/* Attachments Section */}
            <div className="task-section">
              <div className="flex items-center gap-2 mt-4 mb-4">
                <Paperclip className="w-5 h-5 text-gray-600" />
                <span className="text-lg font-bold">Attachments</span>
                <span className="text-sm text-gray-500">
                  ({task.attachments && task.attachments.length > 0 ? task.attachments.length : '0'})
                </span>
              </div>
              
              {task.attachments && task.attachments.length > 0 ? (
                <div className="space-y-3">
                  {task.attachments.map((attachment, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                      <div className="flex items-center gap-3 flex-1">
                        <span className="text-2xl">{getFileIcon(attachment.filename)}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {attachment.filename}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {isImageFile(attachment.filename) && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePreview(attachment)}
                            className="flex items-center gap-1"
                          >
                            <Eye className="w-4 h-4" />
                            Preview
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownload(attachment)}
                          className="flex items-center gap-1"
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No attachments</p>
              )}
            </div>

            {/* Comments Section */}
            <div className="task-section">
              <div className="flex items-center gap-2 mb-4">
                <MessageCircle className="w-5 h-5 text-gray-600" />
                <span className="text-lg font-bold">Comments</span>
                <span className="text-sm text-gray-500">
                  ({task.comments && task.comments.length > 0 ? task.comments.length : '0'})
                </span>
              </div>
              
              {task.comments && task.comments.length > 0 ? (
                <div className="space-y-4">
                  {task.comments.map((comment, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg border">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{comment.email}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(comment.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 ml-10">{comment.text}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No comments</p>
              )}
            </div>

            <div className="task-meta">
              <span>Created on {new Date(task.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</span>
            </div>
          </div>
        </Card>

        {/* Image Preview Modal */}
        {previewImage && (
          <div className="image-preview-modal" onClick={closePreview}>
            <div className="image-preview-content" onClick={(e) => e.stopPropagation()}>
              <div className="image-preview-header">
                <h3 className="image-preview-title">Image Preview</h3>
                <button
                  onClick={closePreview}
                  className="image-preview-close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="image-preview-body">
                <img
                  src={previewImage}
                  alt="Preview"
                  className="image-preview-img"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
