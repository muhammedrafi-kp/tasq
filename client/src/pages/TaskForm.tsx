import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';
import { FileAttachment } from '../components/FileAttachment';
import type { ITask, TaskStatus, TaskPriority } from '../types/index';
import { addTask, getTask,updateTask } from "../services/taskService";
import toast from 'react-hot-toast';

interface AttachedFile {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
}


export const TaskForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [task, setTask] = useState<ITask | null>(null);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingTask, setIsFetchingTask] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const isEditing = id !== 'new' && id !== undefined;
  // Initialize form data based on mode
  const getInitialFormData = () => {
    if (isEditing && task) {
      return {
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
        assignedTo: task.assignedTo?.map(assignee => assignee.email) || [],
      };
    }
    return {
      title: '',
      description: '',
      status: 'pending' as TaskStatus, // New tasks always start as 'pending'
      priority: 'medium' as TaskPriority,
      dueDate: '',
      assignedTo: [],
    };
  };

  const [taskFormData, setTaskFormData] = useState(getInitialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const [currentEmail, setCurrentEmail] = useState('');
  const [removedFiles, setRemovedFiles] = useState<string[]>([]);

  console.log('Task form data:', taskFormData);
  // Fetch task data when editing
  useEffect(() => {
    const fetchTaskData = async () => {
      if (isEditing && id) {
        setIsFetchingTask(true);
        setFetchError(null);

        try {
          const response = await getTask(id);
          if (response.success && response.data) {
            // Update the tasks state with the fetched task
            console.log('Fetched task:', response.data);
            setTask(response.data);
          } else {
            console.error('Failed to fetch task data:', response.message);
            setFetchError('Failed to fetch task data');
          }
        } catch (error) {
          console.error('Error fetching task:', error);
          setFetchError('Error loading task data');
        } finally {
          setIsFetchingTask(false);
        }
      }
    };

    fetchTaskData();
  }, [isEditing, id]);

  useEffect(() => {
    setTaskFormData(getInitialFormData());
    setErrors({}); // Clear errors when switching between add/edit modes
  }, [id, task]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!taskFormData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    // if (!formData.description.trim()) {
    //   newErrors.description = 'Description is required';
    // }

    if (!taskFormData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    } else {
      const dueDate = new Date(taskFormData.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (dueDate < today) {
        newErrors.dueDate = 'Due date cannot be in the past';
      }
    }

    // if (!formData.assignedTo.trim()) {
    //   newErrors.assignedTo = 'assignedTo is required';
    // }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      if (isEditing && task) {
        
        const formData = new FormData();
        formData.append('title', taskFormData.title);
        formData.append('description', taskFormData.description);
        formData.append('status', taskFormData.status);
        formData.append('priority', taskFormData.priority);
        formData.append('dueDate', taskFormData.dueDate);
        taskFormData.assignedTo.forEach(email => {
          formData.append('assignedTo[]', email);
        });
        
        // Add new files
        attachedFiles.forEach(file => {
          formData.append('newFiles', file.file, file.name);
        });
        
        // Add existing files (those not removed)
        const existingFiles = task?.attachments?.filter(attachment => 
          !removedFiles.includes(attachment.filename)
        ) || [];
        existingFiles.forEach(attachment => {
          formData.append('existingFiles[]', JSON.stringify({
            filename: attachment.filename,
            url: attachment.url
          }));
        });
        
        // Add removed files
        removedFiles.forEach(filename => {
          formData.append('removedFiles', filename);
        });
       

        console.log('Form data for update:');
        console.log('- New files:', attachedFiles.map(f => f.name));
        console.log('- Existing files:', existingFiles.map(f => f.filename));
        console.log('- Removed files:', removedFiles);
        console.log('- Form data entries:', Array.from(formData.entries()));

        const res = await updateTask(id, formData);
        console.log('Response:', res);
        if (res.success) {
          console.log('Task updated successfully');
          toast.success('Task updated');
          navigate(`/tasks/${id}`);
        } else {
          console.log('Failed to update task');
          toast.error('Failed to update task');
        }
      } else {  
        // Create new task
        const formData = new FormData();
        formData.append('title', taskFormData.title);
        formData.append('description', taskFormData.description);
        formData.append('status', taskFormData.status);
        formData.append('priority', taskFormData.priority);
        formData.append('dueDate', taskFormData.dueDate);
        // Always send assignedTo as individual fields to ensure it's always an array
        taskFormData.assignedTo.forEach(email => {
          formData.append('assignedTo[]', email);
        });
        attachedFiles.forEach(file => {
          formData.append('files', file.file, file.name);
        });

        console.log('Task form data:', taskFormData);
        console.log('Attached files:', attachedFiles);
        console.log('Form data:', formData);

        const res = await addTask(formData);
        console.log('Response:', res);
        if (res.success) {
          console.log('Task created successfully');
          toast.success('New task created');
          navigate(`/tasks`);
        } else {
          console.log('Failed to create task');
          toast.error('Failed to create task');
        }
      }



      // Navigate back to tasks list
      // navigate('/tasks');
    } catch (error) {
      console.error('Error saving task:', error);
      toast.error('Error saving task');
      // You can add toast notification here
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setTaskFormData(prev => ({ ...prev, [name]: value }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleAddEmail = () => {
    if (currentEmail.trim() && currentEmail.includes('@')) {
      setTaskFormData(prev => ({
        ...prev,
        assignedTo: [...prev.assignedTo, currentEmail.trim()]
      }));
      setCurrentEmail('');
    }
  };

  const handleRemoveEmail = (index: number) => {
    setTaskFormData(prev => ({
      ...prev,
      assignedTo: prev.assignedTo.filter((_, i) => i !== index)
    }));
  };

  const handleRemoveExistingAttachment = (attachmentId: string) => {
    // Extract the actual filename from the attachmentId (which is "existing-{index}")
    const attachmentIndex = parseInt(attachmentId.replace('existing-', ''));
    const attachment = task?.attachments?.[attachmentIndex];
    
    if (attachment) {
      setRemovedFiles(prev => [...prev, attachment.filename]);
    }
  };

  return (
    <DashboardLayout>
      <div className="task-form-container">
        <div className="task-form-header">
          <Link to={`/tasks/${id}`}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {/* Back */}
            </Button>
          </Link>
          <h1 className="task-form-title">
            {isEditing ? 'Edit Task' : 'Create New Task'}
          </h1>
        </div>

        <Card className="task-form-card">
          {isFetchingTask ? (
            <div className="task-form-loading">
              <div className="task-form-loading-content">
                <div className="task-form-spinner"></div>
                <p style={{ color: '#6b7280' }}>Loading task data...</p>
              </div>
            </div>
          ) : fetchError ? (
            <div className="task-form-error">
              <div className="task-form-error-content">
                <p className="task-form-error-title">Error loading task</p>
                <p className="task-form-error-message">{fetchError}</p>
              </div>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
              >
                Try Again
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="form-container">
              <div className="form-row-single">
                <div className="form-field">
                  <Input
                    name="title"
                    label="Task Title"
                    placeholder="Enter task title"
                    value={taskFormData.title}
                    onChange={handleChange}
                    className={errors.title ? 'error' : ''}
                  />
                  {errors.title && (
                    <p className="input-error">{errors.title}</p>
                  )}
                </div>
              </div>

              <div className="form-row-single">
                <div className="form-field">
                  <label className="input-label">
                    Description
                  </label>
                  <textarea
                    name="description"
                    placeholder="Enter task description"
                    value={taskFormData.description}
                    onChange={handleChange}
                    rows={4}
                    className={`input-field ${errors.description ? 'error' : ''}`}
                  />
                  {errors.description && (
                    <p className="input-error">{errors.description}</p>
                  )}
                </div>
              </div>

              <div className="form-row">
                {/* Only show status field when editing an existing task */}
                {isEditing && (
                  <div className="form-field">
                    <Select
                      name="status"
                      label="Status"
                      value={taskFormData.status}
                      onChange={handleChange}
                      options={[
                        { value: 'pending', label: 'To Do' },
                        { value: 'in-progress', label: 'In Progress' },
                        { value: 'completed', label: 'Completed' },
                      ]}
                    />
                  </div>
                )}

                <div className="form-field">
                  <Select
                    name="priority"
                    label="Priority"
                    value={taskFormData.priority}
                    onChange={handleChange}
                    options={[
                      { value: 'low', label: 'Low' },
                      { value: 'medium', label: 'Medium' },
                      { value: 'high', label: 'High' },
                    ]}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-field">
                  <Input
                    name="dueDate"
                    type="date"
                    label="Due Date"
                    value={taskFormData.dueDate}
                    onChange={handleChange}
                    className={errors.dueDate ? 'error' : ''}
                  />
                  {errors.dueDate && (
                    <p className="input-error">{errors.dueDate}</p>
                  )}
                </div>

                <div className="form-field">
                  <label className="input-label">Assigned To</label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      placeholder="Enter email address"
                      value={currentEmail}
                      onChange={(e) => setCurrentEmail(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      onClick={handleAddEmail}
                      disabled={!currentEmail.trim() || !currentEmail.includes('@')}
                      size="sm"
                    >
                      Add
                    </Button>
                  </div>
                  {taskFormData.assignedTo.length > 0 && (
                    <div className="space-y-1">
                      {taskFormData.assignedTo.map((email, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded">
                          <span className="text-sm">{email}</span>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoveEmail(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                  {errors.assignedTo && (
                    <p className="input-error">{errors.assignedTo}</p>
                  )}
                </div>
              </div>

              <div className="form-row-single">
                <FileAttachment
                  files={attachedFiles}
                  onFilesChange={setAttachedFiles}
                  maxFiles={5}
                  maxSizePerFile={10}
                  acceptedTypes={[
                    'image/*',
                    'application/pdf',
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                    'application/msword'
                  ]}
                  existingAttachments={task?.attachments?.filter(attachment => 
                    !removedFiles.includes(attachment.filename)
                  ) || []}
                  onRemoveExistingAttachment={handleRemoveExistingAttachment}
                />
              </div>

              <div className="form-actions">
                <Button
                  type="submit"
                  disabled={isLoading}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isLoading
                    ? (isEditing ? 'Updating...' : 'Creating...')
                    : (isEditing ? 'Update Task' : 'Create Task')
                  }
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(-1)}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
};
