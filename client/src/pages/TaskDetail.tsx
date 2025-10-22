import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Clock, Edit, Trash2, CheckCircle2, Loader2, Download, Eye, MessageCircle, Paperclip, X } from 'lucide-react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ConfirmationModal } from '../components/ui/ConfirmationModal';
// import { useApp } from '../context/AppContext';
import type { ITask } from '../types/index';
import { getTask, markTaskAsComplete, deleteTask } from "../services/taskService";
import { toast } from 'react-hot-toast';


export const TaskDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [task, setTask] = useState<ITask | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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

  // Page-level early returns removed so loader only appears inside the card

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!task) return;

    try {
      setIsDeleting(true);
      // TODO: Implement actual delete API call
      const response = await deleteTask(task.id);
      console.log("delete task response", response);
      if (response.success) {
        toast.success('Task deleted successfully');
        navigate('/tasks');
      } else {
        toast.error(response.message || 'Failed to delete task');
      }
    } catch (err) {
      console.error('Error deleting task:', err);
      toast.error('Failed to delete task. Please try again.');

    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };

  const handleMarkComplete = async () => {
    try {
      if (!task) {
        setError('Task not found');
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      const response = await markTaskAsComplete(task.id);
      console.log("mark task as complete response", response);
      if (response.success) {
        setTask(response.data);
        toast.success('Task marked as complete');
        navigate('/tasks');
      } else {
        setError(response.message || 'Failed to mark task as complete');
        toast.error(response.message || 'Failed to mark task as complete');
      }
    } catch (err) {
      setError('Failed to mark task as complete. Please try again.');
      console.error('Error marking task as complete:', err);
    } finally {
      setLoading(false);
    }
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
          {task && !loading && (
            <>
              <Button variant="outline" onClick={() => navigate(`/tasks/${task.id}/edit`)}>
                <Edit className="w-4 h-4 mr-2" />
              </Button>
              <Button variant="danger" onClick={handleDeleteClick}>
                <Trash2 className="w-4 h-4 mr-2" />
              </Button>
            </>
          )}
        </div>

        <Card className="p-6">
          {/* Card content states: loading, error, not found, content */}
          {loading && (
            <div className="text-center py-12">
              <div className="flex flex-col items-center space-y-4">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                <p className="text-gray-500 text-lg">Loading task details...</p>
              </div>
            </div>
          )}

          {!loading && error && (
            <div className="text-center py-12">
              <div className="space-y-4">
                <p className="text-red-500 text-lg">{error}</p>
                <Button onClick={() => navigate('/tasks')} className="mt-4">
                  Back to Tasks
                </Button>
              </div>
            </div>
          )}

          {!loading && !error && !task && (
            <div className="text-center py-12">
              <div className="space-y-4">
                <p className="text-gray-500 text-lg">Task not found!</p>
                <Button onClick={() => navigate('/tasks')} className="mt-4">
                  Back to Tasks
                </Button>
              </div>
            </div>
          )}

          {!loading && !error && task && (
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-full">
                    {task.attachments.map((attachment, index) => (
                      <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border min-w-0">
                        {isImageFile(attachment.filename) ? (
                          <img
                            src={attachment.url}
                            alt={attachment.filename}
                            className="w-12 h-12 rounded object-cover border flex-shrink-0"
                          />
                        ) : (
                          <span className="text-2xl flex-shrink-0">{getFileIcon(attachment.filename)}</span>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900 truncate" title={attachment.filename}>
                            {attachment.filename}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          {isImageFile(attachment.filename) && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handlePreview(attachment)}
                              title="Preview"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownload(attachment)}
                            title="Download"
                          >
                            <Download className="w-4 h-4" />
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
          )}
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

        {/* Delete Confirmation Modal */}
        <ConfirmationModal
          isOpen={showDeleteModal}
          onClose={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
          title="Delete Task"
          message={`Are you sure you want to delete "${task?.title}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          variant="danger"
          isLoading={isDeleting}
        />
      </div>
    </DashboardLayout>
  );
};
