import React, { useEffect, useState, useCallback } from 'react';
import { Search, Plus, Filter, Loader2, ListTodo } from 'lucide-react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { TaskCard } from '../components/TaskCard';
import { Pagination } from '../components/Pagination';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
// import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import type { TaskStatus, TaskPriority, ITask, ApiResponse } from '../types/index';
import { getTasks } from "../services/taskService"



export const TaskList: React.FC = () => {
  // const { tasks } = useApp();
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<{
    totalCount: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  } | null>(null);

  const fetchTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const params = {
        page: currentPage,
        limit: 9,
        search: searchQuery,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        priority: priorityFilter !== 'all' ? priorityFilter : undefined,
        sortBy: 'createdAt',
        sortOrder: 'desc' as const
      };

      const res: ApiResponse<ITask[]> = await getTasks(params);
      console.log("Tasks : ", res.data);
      
      if (res.success && res.data) {
        setTasks(res.data);
        if (res.pagination) {
          setPagination(res.pagination);
        }
      } else {
        setError('Failed to fetch tasks');
      }
    } catch (error) {
      console.log("Error fetching tasks :", error);
      setError('Failed to fetch tasks');
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, searchQuery, statusFilter, priorityFilter]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleStatusFilterChange = (value: TaskStatus | 'all') => {
    setStatusFilter(value);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handlePriorityFilterChange = (value: TaskPriority | 'all') => {
    setPriorityFilter(value);
    setCurrentPage(1); // Reset to first page when filtering
  };

  // Loading animation component for task list area only
  const TaskListLoadingSpinner = () => (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600 mb-4" />
        <p className="text-gray-600">Loading your tasks...</p>
      </div>
    </div>
  );

  // Error state component for task list area only
  const TaskListErrorState = () => (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ListTodo className="w-8 h-8 text-red-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to load tasks</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={() => fetchTasks()} variant="outline">
          Try Again
        </Button>
      </div>
    </div>
  );

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

        <div
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
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select
              value={statusFilter}
              onChange={(e) => handleStatusFilterChange(e.target.value as TaskStatus | 'all')}
              options={[
                { value: 'all', label: 'All Status' },
                { value: 'pending', label: 'To Do' },
                { value: 'in-progress', label: 'In Progress' },
                { value: 'completed', label: 'Completed' },
              ]}
            />

            <Select
              value={priorityFilter}
              onChange={(e) => handlePriorityFilterChange(e.target.value as TaskPriority | 'all')}
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
            <span>
              {pagination ? (
                `Showing ${((pagination.currentPage - 1) * pagination.limit) + 1} to ${Math.min(pagination.currentPage * pagination.limit, pagination.totalCount)} of ${pagination.totalCount} tasks`
              ) : (
                `Showing ${tasks.length} tasks`
              )}
            </span>
          </div>
        </div>

        {isLoading ? (
          <TaskListLoadingSpinner />
        ) : error && tasks.length === 0 ? (
          <TaskListErrorState />
        ) : tasks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No tasks found matching your filters</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tasks.map((task, index) => (
                <TaskCard key={task.id} task={task} index={index} />
              ))}
            </div>
            
            {pagination && pagination.totalPages > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={pagination.currentPage}
                  totalPages={pagination.totalPages}
                  onPageChange={handlePageChange}
                  totalCount={pagination.totalCount}
                  limit={pagination.limit}
                />
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
};
