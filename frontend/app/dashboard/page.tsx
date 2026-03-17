'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGetMeQuery, useLogoutMutation, useUpdateUserMutation, useDeleteUserMutation } from '../../redux/Apis/UserApi';
import { useGetTasksQuery, useCreateTaskMutation, useUpdateTaskMutation, useDeleteTaskMutation } from '../../redux/Apis/TaskApi';
import type { Task } from '../../redux/Apis/TaskApi';
import { toast } from 'sonner';
import { Button } from '../../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../components/ui/dialog';
import { ChevronLeft, ChevronRight, Edit } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { data: user, isLoading: userLoading, error: userError } = useGetMeQuery();
  const [logout] = useLogoutMutation();
  const [currentPage, setCurrentPage] = useState(1);
  const { data: tasksData, isLoading: tasksLoading, refetch } = useGetTasksQuery({ page: currentPage, limit: 5 });
  const [createTask] = useCreateTaskMutation();
  const [updateTask] = useUpdateTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();

  // User management mutations
  const [updateUser] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // User management state
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });

  useEffect(() => {
    if (!userLoading && !user) {
      router.push('/login');
    }
  }, [user, userLoading, router]);

  // Update profileData whenever user data changes
  useEffect(() => {
    if (user?.data?.user) {
      setProfileData({
        firstName: user.data.user.firstName || '',
        lastName: user.data.user.lastName || '',
        email: user.data.user.email || ''
      });
    }
  }, [user?.data?.user]);

  const handleOpenProfileDialog = () => {
    // Always refresh profile data from current user data when opening dialog
    if (user?.data?.user) {
      setProfileData({
        firstName: user.data.user.firstName || '',
        lastName: user.data.user.lastName || '',
        email: user.data.user.email || ''
      });
    }
    setIsProfileDialogOpen(true);
  };

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      toast.success('Logged out successfully');
      router.push('/login');
    } catch (err: any) {
      toast.error('Logout failed');
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createTask({ title: newTaskTitle, description: newTaskDescription }).unwrap();
      setNewTaskTitle('');
      setNewTaskDescription('');
      toast.success('Task created successfully');
    } catch (err: any) {
      toast.error(err.data?.message || 'Failed to create task');
    }
  };

  const handleUpdateTask = async (task: Task) => {
    const taskId = task.id || task._id;
    if (!taskId) {
      toast.error('Task ID not found');
      return;
    }
    try {
      await updateTask({ id: taskId, body: { status: task.status === 'pending' ? 'completed' : 'pending' } }).unwrap();
      toast.success('Task updated successfully');
    } catch (err: any) {
      toast.error('Failed to update task');
    }
  };

  const handleDeleteTask = async (task: Task) => {
    const taskId = task.id || task._id;
    if (!taskId) {
      toast.error('Task ID not found');
      return;
    }
    try {
      await deleteTask(taskId).unwrap();
      toast.success('Task deleted successfully');
    } catch (err: any) {
      toast.error('Failed to delete task');
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setEditTitle(task.title);
    setEditDescription(task.description);
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingTask) return;
    const taskId = editingTask.id || editingTask._id;
    if (!taskId) {
      toast.error('Task ID not found');
      return;
    }
    try {
      await updateTask({ id: taskId, body: { title: editTitle, description: editDescription } }).unwrap();
      setIsEditDialogOpen(false);
      setEditingTask(null);
      setEditTitle('');
      setEditDescription('');
      toast.success('Task updated successfully');
    } catch (err: any) {
      toast.error('Failed to update task');
    }
  };

  // User management handlers
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateUser({
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        email: profileData.email
      }).unwrap();
      setIsProfileDialogOpen(false);
      toast.success('Profile updated successfully');
      // Refresh user data
      refetch();
    } catch (err: any) {
      toast.error(err.data?.message || 'Failed to update profile');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteUser().unwrap();
      toast.success('Account deleted successfully');
      router.push('/login');
    } catch (err: any) {
      toast.error(err.data?.message || 'Failed to delete account');
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (userLoading || tasksLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (userError || !user) {
    return null; // Will redirect
  }

  const tasks = tasksData?.data?.tasks || [];
  const stats = tasksData?.data?.statistics;
  const pagination = tasksData?.data?.pagination;

  // Filter tasks based on search term
  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate statistics from tasks if not provided by backend
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const pendingTasks = totalTasks - completedTasks;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const displayStats = stats ? {
    totalTasks: stats.totalAllTasks,
    completedTasks: stats.totalCompletedTasks,
    pendingTasks: stats.totalPendingTasks,
    completionRate: stats.completionRate
  } : { totalTasks, completedTasks, pendingTasks, completionRate };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-pink-500/5 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      {/* Header */}
      <header className="relative bg-gradient-to-r from-gray-800/80 to-gray-900/80 backdrop-blur-xl border-b border-gray-700/50 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Dashboard
              </h1>
              <p className="text-gray-400 mt-1">Welcome back, {user.data.user.firstName}!</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleOpenProfileDialog}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-blue-500/25 transform hover:scale-105 transition-all duration-300"
              >
                Edit Profile
              </button>
              <button
                onClick={() => setIsDeleteDialogOpen(true)}
                className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-red-500/25 transform hover:scale-105 transition-all duration-300"
              >
                Delete Account
              </button>
              <button
                onClick={handleLogout}
                className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-red-500/25 transform hover:scale-105 transition-all duration-300"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="relative max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="group relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl p-6 rounded-2xl border border-gray-700/50 hover:border-blue-400/50 transition-all duration-300 hover:transform hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-blue-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <span className="text-xl">📊</span>
                </div>
                <span className="text-2xl font-bold text-blue-400">{displayStats.totalTasks}</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">Total Tasks</h3>
              <p className="text-gray-400 text-sm">All your tasks combined</p>
            </div>
          </div>

          <div className="group relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl p-6 rounded-2xl border border-gray-700/50 hover:border-green-400/50 transition-all duration-300 hover:transform hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-green-600/5 to-green-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                  <span className="text-xl">✅</span>
                </div>
                <span className="text-2xl font-bold text-green-400">{displayStats.completedTasks}</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">Completed</h3>
              <p className="text-gray-400 text-sm">Tasks you've finished</p>
            </div>
          </div>

          <div className="group relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl p-6 rounded-2xl border border-gray-700/50 hover:border-yellow-400/50 transition-all duration-300 hover:transform hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-600/5 to-yellow-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center">
                  <span className="text-xl">⏳</span>
                </div>
                <span className="text-2xl font-bold text-yellow-400">{displayStats.pendingTasks}</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">Pending</h3>
              <p className="text-gray-400 text-sm">Tasks waiting to be done</p>
            </div>
          </div>

          <div className="group relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl p-6 rounded-2xl border border-gray-700/50 hover:border-purple-400/50 transition-all duration-300 hover:transform hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <span className="text-xl">📈</span>
                </div>
                <span className="text-2xl font-bold text-purple-400">{displayStats.completionRate}%</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">Completion Rate</h3>
              <p className="text-gray-400 text-sm">Your productivity score</p>
            </div>
          </div>
        </div>

        {/* Create Task Form */}
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-8 shadow-2xl mb-12">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">Create New Task</h2>
            <p className="text-gray-400">Add a new task to your productivity list</p>
          </div>
          <form onSubmit={handleCreateTask} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Task Title
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter task title"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-300 backdrop-blur-sm"
                    required
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 rounded-xl opacity-0 focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </div>

              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <div className="relative">
                  <textarea
                    placeholder="Enter task description (optional)"
                    value={newTaskDescription}
                    onChange={(e) => setNewTaskDescription(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-300 backdrop-blur-sm resize-none"
                    rows={1}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 rounded-xl opacity-0 focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="group relative inline-flex items-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl shadow-2xl hover:shadow-indigo-500/25 transform hover:scale-105 transition-all duration-300"
              >
                <span className="relative z-10">Create Task</span>
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-purple-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <svg className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          </form>
        </div>

        {/* Tasks List */}
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-8 shadow-2xl">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">Your Tasks</h2>
            <p className="text-gray-400">Manage and track your productivity</p>
          </div>

          {/* Search Input */}
          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search tasks by title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-300 backdrop-blur-sm"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 rounded-xl opacity-0 focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
          </div>

          {filteredTasks.length === 0 ? (
            <div className="text-center py-12">
              {tasks.length === 0 ? (
                <>
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📝</span>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">No tasks yet</h3>
                  <p className="text-gray-400">Create your first task above to get started!</p>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🔍</span>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">No tasks found</h3>
                  <p className="text-gray-400">Try adjusting your search term.</p>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTasks.map((task, index) => (
                <div key={task.id || task._id || `task-${index}`} className="group relative bg-gradient-to-r from-gray-700/50 to-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-600/50 hover:border-indigo-400/30 transition-all duration-300 hover:transform hover:scale-[1.02]">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/5 to-purple-600/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10 flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-bold text-white text-lg mb-2 group-hover:text-indigo-300 transition-colors duration-300">{task.title}</h3>
                      <p className="text-gray-300 mb-3 leading-relaxed">{task.description}</p>
                      <div className="flex items-center gap-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 text-xs font-bold rounded-full ${
                            task.status === 'completed'
                              ? 'bg-green-900/50 text-green-300 border border-green-700/50'
                              : 'bg-yellow-900/50 text-yellow-300 border border-yellow-700/50'
                          }`}
                        >
                          <span className="w-2 h-2 rounded-full mr-2 bg-current"></span>
                          {task.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-3 ml-6">
                      <button
                        onClick={() => handleEditTask(task)}
                        className="group/btn relative inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-semibold rounded-lg shadow-lg hover:shadow-blue-500/25 transform hover:scale-105 transition-all duration-300"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        <span className="relative z-10">Edit</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 rounded-lg opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                      </button>
                      <button
                        onClick={() => handleUpdateTask(task)}
                        className={`group/btn relative inline-flex items-center px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-300 ${
                          task.status === 'completed'
                            ? 'bg-gradient-to-r from-yellow-600 to-yellow-700 text-white hover:from-yellow-700 hover:to-yellow-800 shadow-lg hover:shadow-yellow-500/25'
                            : 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-green-500/25'
                        } transform hover:scale-105`}
                      >
                        <span className="relative z-10">
                          {task.status === 'completed' ? 'Mark Pending' : 'Mark Complete'}
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 rounded-lg opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task)}
                        className="group/btn relative inline-flex items-center px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white text-sm font-semibold rounded-lg shadow-lg hover:shadow-red-500/25 transform hover:scale-105 transition-all duration-300"
                      >
                        <span className="relative z-10">Delete</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 rounded-lg opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-700/50">
              <div className="text-sm text-gray-400">
                Showing {((pagination.currentPage - 1) * pagination.limit) + 1} to {Math.min(pagination.currentPage * pagination.limit, pagination.totalTasks)} of {pagination.totalTasks} tasks
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={!pagination.hasPrevPage}
                  className="border-gray-600/50 text-black hover:bg-gray-700/50 hover:border-indigo-400/50 backdrop-blur-sm transition-all duration-300"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <div className="flex items-center px-4 py-2 bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-600/50">
                  <span className="text-sm text-gray-300">
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!pagination.hasNextPage}
                  className="border-gray-600/50 text-black hover:bg-gray-700/50 hover:border-indigo-400/50 backdrop-blur-sm transition-all duration-300"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Edit Task Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="bg-gradient-to-br from-gray-800/95 to-gray-900/95 backdrop-blur-xl border border-gray-700/50 shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-white">Edit Task</DialogTitle>
              <DialogDescription className="text-gray-400">
                Update the title and description of your task.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Title
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-300 backdrop-blur-sm"
                    placeholder="Enter task title"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 rounded-xl opacity-0 focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <div className="relative">
                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-300 backdrop-blur-sm resize-none"
                    placeholder="Enter task description"
                    rows={3}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 rounded-xl opacity-0 focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </div>
            </div>
            <DialogFooter className="gap-3">
              <Button
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
                className="border-gray-600/50 text-gray-300 hover:bg-gray-700/50 hover:border-gray-500/50 backdrop-blur-sm transition-all duration-300"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveEdit}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-indigo-500/25 transform hover:scale-105 transition-all duration-300"
              >
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Profile Dialog */}
        <Dialog open={isProfileDialogOpen} onOpenChange={setIsProfileDialogOpen}>
          <DialogContent className="bg-gradient-to-br from-gray-800/95 to-gray-900/95 backdrop-blur-xl border border-gray-700/50 shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-white">Edit Profile</DialogTitle>
              <DialogDescription className="text-gray-400">
                Update your personal information.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUpdateProfile} className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    First Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={profileData.firstName}
                      onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-300 backdrop-blur-sm"
                      required
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 rounded-xl opacity-0 focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Last Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={profileData.lastName}
                      onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-300 backdrop-blur-sm"
                      required
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 rounded-xl opacity-0 focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-300 backdrop-blur-sm"
                    required
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 rounded-xl opacity-0 focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </div>
              <DialogFooter className="gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setIsProfileDialogOpen(false)}
                  className="bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 border border-gray-600/50 backdrop-blur-sm transition-all duration-300"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-indigo-500/25 transform hover:scale-105 transition-all duration-300"
                >
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete Account Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="bg-gradient-to-br from-gray-800/95 to-gray-900/95 backdrop-blur-xl border border-gray-700/50 shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-red-400">Delete Account</DialogTitle>
              <DialogDescription className="text-gray-400">
                This action cannot be undone. This will permanently delete your account and all associated data.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <p className="text-white mb-4">
                Are you sure you want to delete your account? All your tasks and data will be permanently removed.
              </p>
            </div>
            <DialogFooter className="gap-3">
              <Button
                variant="secondary"
                onClick={() => setIsDeleteDialogOpen(false)}
                className="border-gray-600/50 text-slate-900 hover:bg-gray-700/50 hover:border-gray-500/50 backdrop-blur-sm transition-all duration-300"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteAccount}
                className="bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold hover:from-red-700 hover:to-red-800 shadow-lg hover:shadow-red-500/25 transform hover:scale-105 transition-all duration-300"
              >
                Delete Account
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}